import * as XLSX from 'xlsx'
import * as fs from 'fs'

const workbook = XLSX.readFile('./Analisis/Formato Camas actualizado OCTUBRE 2026.xlsx')
const sheetName = workbook.SheetNames[0]
const sheet = workbook.Sheets[sheetName]
const json = XLSX.utils.sheet_to_json(sheet, { header: 1 })

console.log("Primeras 20 filas del Excel de referencia:")
for(let i = 0; i < 20; i++) {
  console.log(json[i])
}
