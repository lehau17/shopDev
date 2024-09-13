export const replaceTemplate = (template: string, replaceObj: { [key: string]: string }) => {
  Object.keys(replaceObj).forEach((e) => {
    const wordReplace = `{{${e}}}`
    template = template.replace(new RegExp(wordReplace, 'g'), replaceObj[e])
  })
  return template
}
