"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [results, setResults] = useState([]);

  useEffect(() => {
    async function fetchResults() {
      const res = await fetch(`/api/search?query=${query}`);
      const data = await res.json();
      setResults(data.products || []);
    }
    if (query) fetchResults();
  }, [query]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Search Results for "{query}"</h2>
      {results.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {results.map((product) => (
            <div key={product._id} className="border p-2 rounded">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-40 object-cover"
              />
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.category}</p>
              <p className="text-blue-600 font-bold">${product.offerPrice}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
