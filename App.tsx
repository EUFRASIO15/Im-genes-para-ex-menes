
import React, { useState, useEffect, useCallback } from 'react';

// --- Helper Components (defined outside the main App component to prevent re-creation on re-renders) ---

// Icon for the search button
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
    </svg>
);

// ImageDisplay component to handle loading and error states for the image
interface ImageDisplayProps {
  imageUrl: string | null;
  searchTerm: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageUrl, searchTerm }) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (imageUrl) {
      setError(null);
      setIsLoading(true);
    } else {
        setIsLoading(false);
        setError(null);
    }
  }, [imageUrl]);

  if (!imageUrl && !error) {
    return (
        <div className="mt-8 p-6 border-2 border-dashed border-slate-300 rounded-lg text-center text-slate-500">
            <p>La imagen aparecerá aquí.</p>
        </div>
    );
  }
  
  const handleImageError = () => {
    setError(`No se encontró la imagen para la palabra: "${searchTerm}". Por favor, verifica la ortografía.`);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="mt-8 flex justify-center items-center min-h-[200px]">
      {isLoading && (
        <div className="flex flex-col items-center text-slate-500">
            <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-2">Cargando imagen...</p>
        </div>
      )}
      {error && !isLoading && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center text-red-700">
              <p className="font-semibold">{error}</p>
          </div>
      )}
      <img
        src={imageUrl || ''}
        alt={searchTerm ? `Lengua de signos para: ${searchTerm}` : ''}
        className={`max-w-full max-h-80 object-contain border-2 border-slate-200 rounded-lg shadow-lg transition-opacity duration-500 ${isLoading || error ? 'hidden' : 'block'}`}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
    </div>
  );
};


// --- Main App Component ---

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [submittedTerm, setSubmittedTerm] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const cleanTerm = searchTerm.trim().toLowerCase();
    if (!cleanTerm) {
        setImageUrl(null);
        setSubmittedTerm('');
        return;
    };

    setSubmittedTerm(cleanTerm);
    setImageUrl(`https://fundacioncnse-dilse.org/bddilse/images/stories/${encodeURIComponent(cleanTerm)}.png`);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100 flex flex-col items-center justify-center p-4 font-sans">
      <main className="w-full max-w-2xl mx-auto">
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl shadow-indigo-200/50 p-6 sm:p-10">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
              Buscador de Señas DILSE
            </h1>
            <p className="mt-3 text-slate-600">
              Escribe una palabra para ver su imagen en lengua de signos.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ej: casa, exponente, ..."
              className="flex-grow w-full px-4 py-3 text-lg bg-white border-2 border-slate-200 rounded-lg focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition duration-300"
              aria-label="Palabra a buscar"
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 active:bg-indigo-800 transition duration-300 transform hover:-translate-y-0.5"
            >
              <SearchIcon />
              <span>Buscar</span>
            </button>
          </form>

          <ImageDisplay imageUrl={imageUrl} searchTerm={submittedTerm} />

        </div>
        <footer className="text-center mt-6 text-sm text-slate-500">
          <p>
            Imágenes proporcionadas por{' '}
            <a
              href="https://fundacioncnse-dilse.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              DILSE
            </a>
            .
          </p>
        </footer>
      </main>
    </div>
  );
};

export default App;
