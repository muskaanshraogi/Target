import { savePDF } from '@progress/kendo-react-pdf';

class DocService {
  createPdf = (html, filename) => {
    savePDF(html, { 
      fileName: `${filename}.pdf`,
      margin: 3
    })
  }
}

const Doc = new DocService();
export default Doc;