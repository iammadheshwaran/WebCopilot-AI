import React, { useState } from "react";
import axios from "axios";


const Home = () => {
  const [ideas, setIdeas] = useState("");
  const [category, setCategory] = useState("AI SaaS");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const apiKey = process.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 text-red-800 p-4 rounded-lg
        ">
          <p className="font-semibold">API Key is missing. Please set it in your
          <code className="font-mono bg-gray-200 p-1 rounded">.env</code> file.</p>
        </div>
      </div>
    );
  }

  const handleGenerate = async () => {
    setLoading(true);
    setResult(" ");

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
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
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
                className=" q2 p-5 rounded-lg mb-2"
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
