import React, { useState } from "react";
import axios from "axios";

const Home = () => {
  const [ideas, setIdeas] = useState("");
  const [category, setCategory] = useState("AI SaaS");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setResult("");

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Write a clean and responsive HTML page for a ${category} based on the idea: "${ideas}".
            The page should include:
            - A bold heading
            - A main section with a brief description
            - Three feature card
            - A call-to-action button
            Use plain HTML and TailwindCSS. Return ONLY valid HTML . `,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer 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`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173/",
        },
      }
    );
    setResult(response.data.choices[0].message.content);
    setLoading(false);
  };

  const copyCode = () => {
    navigator.clipboard
      .writeText(result)
      .then(() => {
        alert("code copied!");
      })
      .catch((err) => {
        console.error("Failed to copy code: ", err);
        alert("Failed to copy code. Please try again.");
      });
  };

  return (
    <div>
      <div className="min-h-screen bg-purple-50 font-poppins px-5 py-15">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">
          <h1 className="text-4xl text-center font-bold text-purple-700 mb-6">
            WebCopilot AI
          </h1>

          <input
            type="text"
            value={ideas}
            onChange={(e) => setIdeas(e.target.value)}
            placeholder="Enter your idea here..."
            className="w-full border border-gray-200 p-3 rounded-lg m"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-200 p-3 rounded-lg mt-4"
          >
            <option value="AI SaaS">AI SaaS</option>
            <option value="Productivity Tool">Productivity Tool</option>
            <option value="Startup">Startup</option>
          </select>

          <button
            className="w-full bg-purple-700 text-white font-semibold py-3 rounded-lg mt-4 hover:bg-purple-800"
            onClick={handleGenerate}
          >
            {loading ? "Generating..." : "Generate"}
          </button>

          {result && (
            <div className="mt-10 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
              <div
                className="border p-5 rounded-lg mb-2"
                dangerouslySetInnerHTML={{
                  __html: result,
                }}
              />

              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">HTML Code:</h2>
                <button
                  className=" bg-gray-800 text-white font-semibold px-3 py-2 rounded-lg mt-2 hover:bg-gray-900"
                  onClick={copyCode}
                >
                  Copy Code
                </button>
                <pre className="mt-6 bg-gray-100 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm">{result}</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
