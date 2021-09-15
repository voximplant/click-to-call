export const callButton = document.createElement('div');
callButton.innerText = 'Call';
const url = 'http://localhost:8080';
const openCallWindow = `window.open("${url}/call", "_blank", "width=800,height=600,resizable=no,toolbar=no,menubar=no,location=no,status=no")`;
callButton.setAttribute('onclick', openCallWindow);
if (document.location.pathname === '/button') {
  document.body.appendChild(callButton);
}
callButton.setAttribute(
  'style',
  'background-color: #662eff; margin:20px; cursor:pointer; padding: 8px 16px; text-align: center; border-radius: 4px; position: absolute; color: #fff'
);
