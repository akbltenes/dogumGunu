import { type ChangeEvent } from 'react'

interface FileUploadInputProps {
  previewUrl: string
  onChange: (file: File | null, previewUrl: string) => void
}

const FileUploadInput = ({ previewUrl, onChange }: FileUploadInputProps) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      const reader = new FileReader()
      reader.onloadend = () => {
        onChange(selectedFile, reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  return (
    <div className="mb-6 space-y-3">
      <label htmlFor="file" className="block text-sm font-semibold text-[#6e4d55] dark:text-gray-200">
        Fotoğraf Seç
      </label>
      <input
        type="file"
        id="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full cursor-pointer text-sm text-[#89616b]
          file:mr-4 file:rounded-full file:border-0 file:bg-primary/10 file:px-5 file:py-2.5 file:text-sm file:font-semibold file:text-primary
          hover:file:bg-primary/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary/50 dark:text-gray-200 dark:file:bg-white/10 dark:file:text-white"
      />
      {previewUrl && (
        <div className="relative mt-4 flex h-52 items-center justify-center overflow-hidden rounded-2xl border border-rose-100 bg-[#f8f6f6] p-4 dark:border-white/10 dark:bg-[#1b0d11]">
          <img src={previewUrl} alt="Preview" className="max-h-full w-full object-contain" />
        </div>
      )}
    </div>
  )
}

export default FileUploadInput
