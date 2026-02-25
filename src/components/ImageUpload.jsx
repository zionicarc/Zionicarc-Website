import React, { useState } from 'react';
import { storage } from '../lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Upload, X, CheckCircle, Loader2 } from 'lucide-react';

export default function ImageUpload({ onUploadComplete, currentImage, acceptedFiles = "image/*" }) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check if Firebase storage is configured
        if (!storage) {
            alert('Firebase Storage not configured. To use image uploads:\n\n1. Create a .env file based on .env.example\n2. Add your Firebase credentials\n3. Restart the dev server\n\nFor now, you can use direct image URLs instead.');
            return;
        }

        setUploading(true);
        const storageRef = ref(storage, `site-images/${Date.now()}-${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgress(prog);
            },
            (error) => {
                console.error("Upload Error:", error);
                alert("Upload failed: " + error.message);
                setUploading(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    onUploadComplete(downloadURL);
                    setUploading(false);
                    setProgress(0);
                });
            }
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                {currentImage && (
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-black/5 bg-gray-50 shrink-0">
                        <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <CheckCircle size={20} className="text-white" />
                        </div>
                    </div>
                )}

                <label className={`flex-1 flex flex-col items-center justify-center h-20 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${uploading ? 'bg-gray-50 border-gray-200' : 'bg-white border-black/5 hover:border-black/10'}`}>
                    {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin text-black" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-black">{progress}%</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-1">
                            <Upload className="w-5 h-5 text-gray-400" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Upload Image</span>
                        </div>
                    )}
                    <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} accept={acceptedFiles} />
                </label>
            </div>
        </div>
    );
}
