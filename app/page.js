'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [prompts, setPrompts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    let query = supabase.from('prompts').select('*').order('created_at', { ascending: false });

    if (search) {
      // 模糊搜索：匹配中英文名称，或者中英文提示词
      query = query.or(`name_zh.ilike.%${search}%,name_en.ilike.%${search}%,prompt_zh.ilike.%${search}%,prompt_en.ilike.%${search}%`);
    }
    if (category) {
      query = query.eq('sub_category', category);
    }

    const { data, error } = await query;
    if (!error) setPrompts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [search, category]);

  return (
    <main className="max-w-6xl mx-auto p-8 font-sans">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">💄 提示词库</h1>
        <Link href="/admin" className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition">
          + 添加新提示词
        </Link>
      </div>

      {/* 搜索与筛选栏 */}
      <div className="flex gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm border">
        <input
          type="text"
          placeholder="搜索提示词、名称..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border p-2 rounded focus:outline-emerald-500"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded bg-white"
        >
          <option value="">所有分类</option>
          <option value="serum">Serum / 精华</option>
          <option value="cream">Cream / 面霜</option>
          <option value="lipstick">Lipstick / 口红</option>
          <option value="perfume">Perfume / 香水</option>
          <option value="makeup">Makeup / 彩妆</option>
        </select>
      </div>

      {/* 结果展示 */}
      {loading ? (
        <p className="text-center text-gray-500">加载中...</p>
      ) : prompts.length === 0 ? (
        <p className="text-center text-gray-500 py-10">没有找到相关提示词</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition">
              <img src={item.image_url} alt={item.name_zh} className="w-full h-64 object-cover bg-gray-100" />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="font-bold text-lg text-gray-800">{item.name_zh}</h2>
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">{item.sub_category}</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.prompt_zh}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">评分: {'⭐'.repeat(item.score || 0)}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(item.prompt_zh)}
                    className="text-emerald-600 hover:underline"
                  >
                    复制提示词
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}