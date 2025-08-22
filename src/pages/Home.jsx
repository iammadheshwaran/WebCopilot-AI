import React, { useState } from "react";
import axios from "axios";

const Home = () => {
  const [ideas, setIdeas] = useState("");
  const [category, setCategory] = useState("AI SaaS");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // Api key from environment variables
  const apiKey = import.meta.env?.VITE_OPENROUTER_API_KEY;


  const handleGenerate = async () => {
    if (!ideas.trim()) {
      alert("Please enter an idea first!");
      return;
    }

    if (!apiKey) {
      alert("API key not found. Please check your .env file.");
      return;
    }

    setLoading(true);
    setResult("");

    try {
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
              - Three feature cards
              - A call-to-action button
              Use plain HTML and TailwindCSS. Return ONLY valid HTML without any markdown formatting or code blocks.`,
            },
          ],
          max_tokens: 2000,
          temperature: 0.7,
        },
        {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": window.location.origin, // Optional but recommended
            "X-Title": "WebCopilot AI", 
          },
        }
      );
      
      setResult(response.data.choices[0].message.content);
    } catch (error) {
      console.error("Error generating content:", error);
      alert("Failed to generate content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    if (!result) {
      alert("No code to copy!");
      return;
    }

    navigator.clipboard
      .writeText(result)
      .then(() => {
        alert("Code copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy code: ", err);
        alert("Failed to copy code. Please try again.");
      });
  };

  return (
    <div>
      <div className="min-h-screen bg-purple-50 font-poppins px-5 py-15">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
          <h1 className="text-4xl text-center font-bold text-purple-700 mb-6">
            WebCopilot AI
          </h1>

          <div className="space-y-4">
            <input
              type="text"
              value={ideas}
              onChange={(e) => setIdeas(e.target.value)}
              placeholder="Enter your idea here... (e.g., AI-powered task manager)"
              className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="AI SaaS">AI SaaS</option>
              <option value="Productivity Tool">Productivity Tool</option>
              <option value="Startup">Startup</option>
              <option value="E-commerce">E-commerce</option>
              <option value="Social Media">Social Media</option>
              <option value="Healthcare">Healthcare</option>
            </select>

            <button
              className="w-full bg-purple-700 text-white font-semibold py-3 rounded-lg hover:bg-purple-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>

          {result && (
            <div className="mt-10">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Live Preview</h2>
              
              {/* Preview Container */}
              <div className="border border-gray-300 rounded-lg mb-6 overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 border-b">
                  <span className="text-sm text-gray-600">Preview</span>
                </div>
                <div
                  className="p-5 bg-white min-h-96 overflow-auto"
                  dangerouslySetInnerHTML={{
                    __html: result,
                  }}
                />
              </div>

              {/* Code Section */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">HTML Code</h2>
                  <button
                    className="bg-gray-800 text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors"
                    onClick={copyCode}
                  >
                    Copy Code
                  </button>
                </div>
                
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <pre className="p-4 overflow-x-auto text-sm">
                    <code className="text-green-500 whitespace-pre-wrap break-words">
                      {result}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;