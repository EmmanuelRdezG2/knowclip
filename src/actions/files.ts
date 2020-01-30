import { nowUtcTimestamp } from '../utils/sideEffects'

export const addFile = <F extends FileMetadata>(file: F): AddFile => ({
  type: A.ADD_FILE,
  file,
})

export const deleteFileRequest = (
  fileType: FileMetadata['type'],
  id: FileId
): DeleteFileRequest => ({
  type: 'DELETE_FILE_REQUEST',
  fileType,
  id,
})
export const deleteFileSuccess = (
  file: FileMetadata,
  descendants: Array<FileMetadata>
): DeleteFileSuccess => ({
  type: 'DELETE_FILE_SUCCESS',
  file,
  descendants,
})
/** Try to open a file, and add it to the state tree if it isn't there yet. */
export const openFileRequest = (
  file: FileMetadata,
  filePath: FilePath | null = null
): OpenFileRequest => ({
  type: 'OPEN_FILE_REQUEST',
  file,
  filePath, // necessary?
})
export const openFileSuccess = (
  file: FileMetadata,
  filePath: FilePath,
  timestamp: string = nowUtcTimestamp()
): OpenFileSuccess => ({
  type: 'OPEN_FILE_SUCCESS',
  validatedFile: file,
  filePath,
  timestamp,
})
export const openFileFailure = (
  file: FileMetadata,
  filePath: FilePath | null,
  errorMessage: string
): OpenFileFailure => ({
  type: 'OPEN_FILE_FAILURE',
  file,
  filePath,
  errorMessage,
})
export const locateFileRequest = (
  file: FileMetadata,
  message: string
): LocateFileRequest => ({
  type: 'LOCATE_FILE_REQUEST',
  file,
  message,
})
export const locateFileSuccess = (
  file: FileMetadata,
  filePath: FilePath
): LocateFileSuccess => ({
  type: 'LOCATE_FILE_SUCCESS',
  file,
  filePath,
})

export const preloadVideoStills = (
  file: FileMetadata,
  clipId: ClipId
): PreloadVideoStills => ({
  type: A.PRELOAD_VIDEO_STILLS,
  clipId,
  file,
})
