"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

interface Subscription {
  plan: string | null;
  status: string;
}

export default function Dashboard() {
  const [sub, setSub] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchSubscription(token);
  }, []);

  async function fetchSubscription(token: string) {
    try {
      const res = await fetch(`${API_BASE}/subscriptions/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      setSub(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubscribe(plan: "monthly" | "yearly") {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const res = await fetch(`${API_BASE}/subscriptions/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    if (data.codeUrl) {
      // In a real app, show QR code. Here we just show the URL or mock success.
      alert(`Please pay via WeChat: ${data.codeUrl}\n\n(Click OK to simulate payment success)`);
      // Mock success for demo
      await fetch(`${API_BASE}/subscriptions/mock-success`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` }
      });
      fetchSubscription(token);
    }
  }

  async function handleGenerate() {
    setAiLoading(true);
    setAiResult("");
    const token = localStorage.getItem("accessToken");
    try {
      const res = await fetch(`${API_BASE}/ai/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setAiResult(data.result);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setAiLoading(false);
    }
  }

  async function handleAnalyze() {
    setAiLoading(true);
    setAiResult("");
    const token = localStorage.getItem("accessToken");
    try {
      const res = await fetch(`${API_BASE}/ai/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: emailContent }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setAiResult(data.result);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setAiLoading(false);
    }
  }

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white p-6 rounded shadow flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="space-x-4">
             <span className="text-gray-600">
                Plan: {sub?.status === 'active' ? sub.plan : 'Free'}
             </span>
             <button 
               onClick={() => {
                   localStorage.removeItem('accessToken');
                   router.push('/login');
               }}
               className="text-red-600 hover:text-red-800"
             >
               Logout
             </button>
          </div>
        </div>

        {sub?.status !== "active" && (
          <div className="bg-blue-50 p-6 rounded border border-blue-200">
            <h3 className="text-lg font-semibold mb-4">Upgrade to Premium</h3>
            <div className="flex gap-4">
              <div className="border p-4 rounded bg-white flex-1">
                <h4 className="font-bold">Monthly</h4>
                <p className="text-2xl my-2">¥19.9</p>
                <button
                  onClick={() => handleSubscribe("monthly")}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Subscribe
                </button>
              </div>
              <div className="border p-4 rounded bg-white flex-1">
                <h4 className="font-bold">Yearly</h4>
                <p className="text-2xl my-2">¥199</p>
                <button
                  onClick={() => handleSubscribe("yearly")}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Email Generator</h2>
            <textarea
              className="w-full border rounded p-2 h-32 mb-4"
              placeholder="Describe the email you want to write..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button
              onClick={handleGenerate}
              disabled={aiLoading}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {aiLoading ? "Generating..." : "Generate"}
            </button>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Email Analyzer</h2>
            <textarea
              className="w-full border rounded p-2 h-32 mb-4"
              placeholder="Paste email content to analyze..."
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
            />
            <button
              onClick={handleAnalyze}
              disabled={aiLoading}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
            >
              {aiLoading ? "Analyzing..." : "Analyze"}
            </button>
          </div>
        </div>

        {aiResult && (
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-bold mb-2">AI Result</h3>
            <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
              {aiResult}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
