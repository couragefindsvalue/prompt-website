'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AddPrompt() {
  // 1. 补全了 name_en 和 prompt_en
  const [form, setForm] = useState({
    source_id: '', sub_category: '',
    name_zh: '', name_en: '',
    prompt_zh: '', prompt_en: '',
    image_url: '', score: '', failure_notes: ''
  });
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('prompts').insert([{
      ...form,
      tags: [],
      score: form.score ? parseInt(form.score) : null
    }]);
    if (error) setMsg(`❌ 失败: ${error.message}`);
    else {
      setMsg('✅ 保存成功！');
      // 保存成功后清空所有字段
      setForm({
        source_id: '', sub_category: '',
        name_zh: '', name_en: '',
        prompt_zh: '', prompt_en: '',
        image_url: '', score: '', failure_notes: ''
      });
    }
  };

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <main className="max-w-2xl mx-auto p-8 font-sans">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">💄 添加提示词</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-sm border">
        <input required placeholder="源ID (如 social-359)" value={form.source_id} onChange={update('source_id')} className="w-full border p-2 rounded" />
        <input required placeholder="子分类 (如 serum)" value={form.sub_category} onChange={update('sub_category')} className="w-full border p-2 rounded" />

        {/* 中文和英文名称 */}
        <div className="flex gap-4">
          <input required placeholder="中文名称 (如 Lumé护肤平铺图)" value={form.name_zh} onChange={update('name_zh')} className="w-1/2 border p-2 rounded" />
          <input placeholder="英文名称 (如 Lumé Skincare Flatlay)" value={form.name_en} onChange={update('name_en')} className="w-1/2 border p-2 rounded" />
        </div>

        {/* 中文和英文提示词 */}
        <textarea required placeholder="完整中文提示词" value={form.prompt_zh} onChange={update('prompt_zh')} className="w-full border p-2 rounded h-24" />
        <textarea placeholder="完整英文提示词" value={form.prompt_en} onChange={update('prompt_en')} className="w-full border p-2 rounded h-24" />

        <input required placeholder="图片链接 (jsDelivr CDN 地址)" value={form.image_url} onChange={update('image_url')} className="w-full border p-2 rounded" />

        <div className="flex gap-4">
          <input type="number" placeholder="评分 (1-5)" value={form.score} onChange={update('score')} className="w-1/2 border p-2 rounded" />
          <input placeholder="失败原因/备注" value={form.failure_notes} onChange={update('failure_notes')} className="w-1/2 border p-2 rounded" />
        </div>
        <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition">保存到数据库</button>
      </form>
      {msg && <p className="mt-4 text-center font-medium text-gray-700">{msg}</p>}
    </main>
  );
}