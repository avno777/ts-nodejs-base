import fs from 'fs'
import pdfParse from 'pdf-parse'
import { IOriginalBook, IChapter } from '../models/database/originBook.model' // Import các interface đã định nghĩa

// Hàm này sẽ xử lý PDF và trả về dữ liệu book theo cấu trúc của model
export const processPDF = async (filePath: string): Promise<IChapter[]> => {
  console.log('filePath', filePath)
  const dataBuffer = fs.readFileSync(filePath)
  const pdfData = await pdfParse(dataBuffer)
  const text = pdfData.text

  const titleRegex = /(Harry Potter and the [^\n]+)\n([^\n]+)/i
  const titleMatch = titleRegex.exec(text)

  let bookTitle = 'Harry Potter' // Tiêu đề mặc định nếu không tìm thấy

  if (titleMatch) {
    bookTitle = `${titleMatch[1].trim()}` // Gộp hai dòng tiêu đề
  }
  console.log('bookTitle', bookTitle)
  //console.log(text)
  // Logic để tách nội dung thành các chapter dựa trên định dạng của file PDF
  // Giả sử mỗi chapter bắt đầu với "Chapter {số}" và mỗi chương mới là một dòng mới trong PDF
  const chapterRegex = /— CHAPTER (\w+) —/g
  const chapters: IChapter[] = []
  let match
  let lastIndex = 0
  while ((match = chapterRegex.exec(text)) !== null) {
    if (chapters.length > 0) {
      // Cắt đoạn text từ lastIndex đến match.index để lấy nội dung chapter
      const content = text.slice(lastIndex, match.index).trim()
      chapters[chapters.length - 1].content = content
    }
    const chapterNumber = match[1].replace(/-/g, '').trim()

    // Lấy title từ dòng tiếp theo sau CHAPTER
    const chapterStartIndex = match.index + match[0].length
    const remainingText = text.slice(chapterStartIndex).trim()
    const titleMatch = remainingText.split('\n')[0].trim() // Lấy dòng đầu tiên ngay dưới dòng CHAPTER
    console.log(titleMatch)
    // Tạo một chapter mới
    chapters.push({
      chapterNumber: chapterNumber,
      title: titleMatch,
      content: '',
      images: []
    })

    lastIndex = match.index
  }

  // Xử lý chapter cuối cùng
  if (chapters.length > 0) {
    chapters[chapters.length - 1].content = text.slice(lastIndex).trim()
  }

  // Tạo đối tượng sách với các chương đã xử lý
  //   const bookData: IOriginalBook = {
  //     title: 'Tên sách từ PDF', // Cập nhật title dựa trên nội dung thực tế
  //     //author: 'AUTHOR_ID', // Gán authorId thực tế
  //     chapters: chapters,
  //     description: 'Mô tả sách từ PDF'
  //   }
  return chapters
}
