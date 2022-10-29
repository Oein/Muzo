export function textToAuthKey(text: string, salt: string): string {
  if (text.length > 128) {
    text = text.slice(0, 128);
  }
  const a = text.slice(0, text.length / 2);
  const b = text.slice(text.length / 2 + 1, text.length / 2);
  const c = a + salt + b;
  const d = btoa(c);
  let e = btoa(d + salt);
  let h = 0;
  while (e.length > 128 && h < 10) {
    let f = "";
    for (let i = 0; i < e.length; i += 2) {
      let g = e.charCodeAt(i);
      if (i + 1 < e.length) {
        g += e.charCodeAt(i + 1);
      }
      f += (g / 3).toString(36);
    }
    e = f;
    h++;
  }
  if (e.length > 128) {
    e = e.slice(0, 128);
  }
  return e;
}
