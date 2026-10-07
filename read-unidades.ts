import * as XLSX from 'xlsx'

const workbook = XLSX.readFile('Analisis/UNIDADES_ID_REFERENCIA.xlsx')
const sheetName = workbook.SheetNames[0]
const worksheet = workbook.Sheets[sheetName]
const data = XLSX.utils.sheet_to_json(worksheet)

console.log('Columnas UNIDADES:', Object.keys(data[0] || {}))
console.log('Primeras 3 filas:')
console.table(data.slice(0, 3))
