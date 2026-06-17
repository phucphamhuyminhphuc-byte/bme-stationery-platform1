import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Xử lý tải tệp tin (Hình ảnh, Document) lên Supabase Storage
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    // Phân loại bucket lưu trữ: 'images', 'documents'
    const bucket = formData.get('bucket') as string || 'multimedia'; 

    if (!file) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy file' }, { status: 400 });
    }

    // Tạo tên tệp độc nhất để tránh trùng lặp
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    // Đẩy file lên Cloud Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) throw error;

    // Trích xuất Public URL của tệp tin vừa tải lên
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return NextResponse.json({ 
      success: true, 
      url: publicUrl,  // <-- URL trả về để chèn vào bảng posts/files
      path: filePath 
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}