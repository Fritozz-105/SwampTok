import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, AlertCircle, CheckCircle } from 'lucide-react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../tools/firebase';

interface VideoUploadProps {
    onUploadComplete: (url: string) => void;
    onError?: (error: Error) => void;
    maxSizeMB?: number;
}

const VideoUpload: React.FC<VideoUploadProps> = ({
    onUploadComplete,
    onError,
    maxSizeMB = 100
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadComplete, setUploadComplete] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle file selection
    const handleFileSelect = (selectedFile: File | null) => {
        if (!selectedFile) return;

        // Reset states
        setUploadError(null);
        setUploadComplete(false);
        setUploadProgress(0);

        // Validate file type
        const validVideoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv'];
        if (!validVideoTypes.includes(selectedFile.type)) {
        setUploadError('Please select a valid video file (MP4, MOV, AVI, WMV)');
        return;
        }

        // Validate file size
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        if (selectedFile.size > maxSizeBytes) {
        setUploadError(`File size exceeds ${maxSizeMB}MB limit`);
        return;
        }

        setFile(selectedFile);
    };

    // Handle file upload to Firebase Storage
    const uploadVideo = useCallback(async () => {
        if (!file) return;

        try {
            setIsUploading(true);

            // Create a storage reference with a unique name
            const storageRef = ref(storage, `videos/${Date.now()}-${file.name}`);

            // Upload file and track progress
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                // Track upload progress
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setUploadProgress(progress);
                },
                (error) => {
                // Handle errors
                console.error('Upload error:', error);
                setUploadError('Failed to upload video. Please try again.');
                setIsUploading(false);
                if (onError) onError(error);
                },
                async () => {
                // Upload completed successfully
                const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                setVideoUrl(downloadUrl);
                setUploadComplete(true);
                setIsUploading(false);
                onUploadComplete(downloadUrl);
                }
            );
        } catch (error) {
            console.error('Error starting upload:', error);
            setUploadError('Failed to start upload. Please try again.');
            setIsUploading(false);

            if (onError && error instanceof Error) {
                onError(error);
            }
        }
    }, [file, onError, onUploadComplete]);

    // Drag and drop handlers
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    // Trigger file input click
    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    // Handle file input change
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
        handleFileSelect(e.target.files[0]);
        }
    };

    // Reset the component state
    const handleReset = () => {
        setFile(null);
        setUploadProgress(0);
        setUploadError(null);
        setIsUploading(false);
        setUploadComplete(false);
        setVideoUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="w-full">
        {/* Hidden file input */}
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept="video/mp4,video/quicktime,video/x-msvideo,video/x-ms-wmv"
            className="hidden"
        />

        {/* Drag and drop area or file info */}
        {!file ? (
            <div
                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                    isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
            >

            <Upload className="w-12 h-12 text-gray-400 mb-3" />

            <p className="text-gray-700 font-medium mb-1">Drag and drop your video here</p>
            <p className="text-gray-500 text-sm mb-3">or click to select a file</p>
            <p className="text-gray-400 text-xs">
                Supported formats: MP4, MOV, AVI, WMV (max {maxSizeMB}MB)
            </p>
            </div>
        ) : (
            <div className="border rounded-lg p-4">

            {/* File info and actions */}
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-md flex items-center justify-center mr-3">
                    <Upload className="w-5 h-5 text-blue-600" />
                </div>
                <div className="overflow-hidden">
                    <p className="font-medium text-gray-800 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                </div>
                </div>

                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleReset();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                    >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Progress bar */}
            {(isUploading || uploadComplete) && (
                <div className="mt-2 mb-3">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                    className={`h-full ${
                        uploadComplete ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${uploadProgress}%` }}
                    ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    {uploadComplete
                    ? 'Upload complete'
                    : `Uploading: ${uploadProgress}%`}
                </p>
                </div>
            )}

            {/* Error message */}
            {uploadError && (
                <div className="flex items-center text-red-500 text-sm mt-2">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span>{uploadError}</span>
                </div>
            )}

            {/* Success message */}
            {uploadComplete && (
                <div className="flex items-center text-green-500 text-sm mt-2">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span>Video uploaded successfully</span>
                </div>
            )}

            {/* Upload button */}
            {!isUploading && !uploadComplete && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        uploadVideo();
                    }}
                    className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                    Upload Video
                </button>
            )}

            {/* Video preview if upload is complete */}
            {uploadComplete && videoUrl && (
                <div className="mt-4">
                    <video
                        className="w-full rounded-md"
                        controls
                        src={videoUrl}
                    >
                    </video>
                </div>
            )}
            </div>
        )}
        </div>
    );
};

export default VideoUpload;
