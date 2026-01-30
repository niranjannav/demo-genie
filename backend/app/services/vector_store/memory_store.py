"""
In-memory vector store for session-based RAG retrieval.

Uses sentence-transformers for local, cost-free embeddings.
"""

from typing import List, Dict
import numpy as np

from app.logging_config import logger


class MemoryVectorStore:
    """
    In-memory vector store using numpy for similarity search.

    Stores document chunks and their embeddings per session (file_id).
    Uses sentence-transformers for embedding generation.
    """

    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        """
        Initialize the vector store.

        Args:
            model_name: Name of the sentence-transformers model to use
        """
        self.model_name = model_name
        self._model = None
        self.documents: Dict[str, Dict] = {}  # session_id -> {chunks, embeddings}
        logger.info(f"MemoryVectorStore initialized with model: {model_name}")

    @property
    def model(self):
        """Lazy load the embedding model."""
        if self._model is None:
            logger.info(f"Loading sentence-transformers model: {self.model_name}")
            try:
                from sentence_transformers import SentenceTransformer
                self._model = SentenceTransformer(self.model_name)
                logger.info("Model loaded successfully")
            except Exception as e:
                logger.error(f"Failed to load model: {type(e).__name__}: {e}")
                raise
        return self._model

    def add(self, session_id: str, chunks: List[str]) -> None:
        """
        Add document chunks to the store.

        Args:
            session_id: Unique identifier for this document session (file_id)
            chunks: List of text chunks to store
        """
        logger.info(f"Adding {len(chunks)} chunks to session: {session_id}")

        if not chunks:
            logger.error("No chunks provided")
            raise ValueError("No chunks provided")

        # Generate embeddings for all chunks
        logger.debug("Generating embeddings...")
        try:
            embeddings = self.model.encode(chunks, convert_to_numpy=True)
            logger.debug(f"Embeddings shape: {embeddings.shape}")
        except Exception as e:
            logger.error(f"Error generating embeddings: {type(e).__name__}: {e}")
            raise

        # Normalize embeddings for cosine similarity
        norms = np.linalg.norm(embeddings, axis=1, keepdims=True)
        normalized_embeddings = embeddings / norms

        # Store in memory
        self.documents[session_id] = {
            "chunks": chunks,
            "embeddings": normalized_embeddings,
        }
        logger.info(f"Successfully stored {len(chunks)} chunks for session: {session_id}")

    def search(
        self,
        session_id: str,
        query: str,
        top_k: int = 5,
    ) -> List[str]:
        """
        Search for similar chunks using cosine similarity.

        Args:
            session_id: Session to search in
            query: Query text
            top_k: Number of results to return

        Returns:
            List of most similar chunks
        """
        logger.info(f"Searching session {session_id} for: '{query[:50]}...'")

        if session_id not in self.documents:
            logger.error(f"Session not found: {session_id}")
            raise KeyError(f"Session not found: {session_id}")

        doc = self.documents[session_id]

        # Generate query embedding
        logger.debug("Generating query embedding...")
        query_embedding = self.model.encode([query], convert_to_numpy=True)
        query_norm = np.linalg.norm(query_embedding)
        query_normalized = query_embedding / query_norm

        # Compute cosine similarities (dot product of normalized vectors)
        similarities = np.dot(doc["embeddings"], query_normalized.T).flatten()

        # Get top-k indices
        top_indices = np.argsort(similarities)[-top_k:][::-1]
        top_scores = similarities[top_indices]

        logger.debug(f"Top {top_k} similarity scores: {top_scores}")
        logger.info(f"Found {len(top_indices)} matching chunks")

        # Return top chunks
        return [doc["chunks"][i] for i in top_indices]

    def get_chunks(self, session_id: str) -> List[str]:
        """Get all chunks for a session."""
        if session_id not in self.documents:
            logger.warning(f"Session not found: {session_id}")
            return []
        return self.documents[session_id]["chunks"]

    def delete(self, session_id: str) -> bool:
        """Delete a session's data."""
        if session_id in self.documents:
            del self.documents[session_id]
            logger.info(f"Deleted session: {session_id}")
            return True
        return False

    def clear(self) -> None:
        """Clear all stored documents."""
        self.documents.clear()
        logger.info("Cleared all documents from vector store")

    def session_exists(self, session_id: str) -> bool:
        """Check if a session exists."""
        return session_id in self.documents


# Global instance for the application
vector_store = MemoryVectorStore()
