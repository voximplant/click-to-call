export function getParameters(): { [key: string]: string } {
  return window.location.href
    .substring(window.location.href.indexOf('?') + 1)
    .split('&')
    .filter((param) => /^x-/i.test(param))
    .reduce((acc: { [key: string]: string }, value) => {
      const [key, val] = value.split('=');
      acc[key] = val;
      return acc;
    }, {});
}
