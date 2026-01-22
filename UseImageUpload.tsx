import { useState, useCallback, useRef, useEffect } from 'react';

export const useImageUpload = () => {
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

 
  const uploadImage = useCallback(async () => {
    if (isUploading) return;
    
    setIsUploading(true);

    try {
     
      const newImage = await new Promise<string>((resolve) => {
        setTimeout(() => {
          resolve(`https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80&sig=${Date.now()}`);
        }, 2000); 
      });

      if (isMounted.current) {
        setAttachments(prev => [...prev, newImage]);
      }
    } catch (error) {
      console.error("Upload failed:", error);
     
    } finally {
      if (isMounted.current) {
        setIsUploading(false);
      }
    }
  }, [isUploading]);

 
  const removeAttachment = useCallback((uri: string) => {
    setAttachments(prev => prev.filter(item => item !== uri));
  }, []);

  
  const clearAttachments = useCallback(() => {
    setAttachments([]);
  }, []);

  return {
    attachments,
    isUploading,
    uploadImage,
    removeAttachment,
    clearAttachments,
  };
};