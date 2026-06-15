export interface UploadOptions {
  onProgress?: (percent: number) => void;
}

export const mockUploadToS3 = (file: File, options?: UploadOptions): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Basic file validations (normally done before upload)
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return reject(new Error('Invalid file type. Only PDF, JPG, and PNG are allowed.'));
    }

    if (file.size > maxSizeBytes) {
      return reject(new Error('File is too large. Maximum size is 5MB.'));
    }

    let progress = 0;
    const intervalTime = 150; // Milliseconds
    const totalSteps = 10;
    const progressStep = 100 / totalSteps;

    const interval = setInterval(() => {
      progress += progressStep;
      if (options?.onProgress) {
        options.onProgress(Math.min(Math.round(progress), 100));
      }

      if (progress >= 100) {
        clearInterval(interval);
        
        // Generate a mock S3 URL
        const cleanName = file.name.replace(/\s+/g, '_');
        const randomId = Math.random().toString(36).substring(2, 8);
        const mockUrl = `https://prajna-proof-bucket.s3.ap-south-1.amazonaws.com/uploads/${randomId}_${cleanName}`;
        
        resolve(mockUrl);
      }
    }, intervalTime);
  });
};
