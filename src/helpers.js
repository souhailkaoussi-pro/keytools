import MainPage from './mainPage'
import { css } from 'glamor';

//Constants
export const constants = {
  INDEX_MAX: 4294967295,
  KEYS_MAX: 100000
}

//Check if numeric string
export function isNumeric(val) {
  //numerics and last character is not a dot and number of dots is 0 or 1
  let isnum = /(?<=^| )\d+(\.\d+)?(?=$| )/.test(val)
  if (isnum) {
    return true
  }
  else {
    return false
  }
}

//Copy any text to clipboard
export function copyText(event) {
  var dummy = document.createElement("input")
  document.body.appendChild(dummy)
  dummy.setAttribute('value', event.target.value)
  dummy.select()
  let success = document.execCommand("copy")
  document.body.removeChild(dummy)

  if (success) {
    new MainPage().notifyCopy()
  }
  else {
    new MainPage().notifyCopyFail()
  }
}

//Toast styling
export const toastType = {
  SUCCESS: 'success',
  SUCCESS_AUTO: 'success-auto',
  ERROR: 'error',
  ERROR_AUTO: 'error-auto',
  ERROR_AUTO_LONG: 'error-auto-long'
}

export function getToast(id) {
  const colorRed = 'rgba(214,95,100,1.0)'
  const colorBlue = 'rgba(74,144,226,1.0)'

  var color = ''
  switch (id) {
    case toastType.SUCCESS:
    color = colorBlue
    break

    case toastType.SUCCESS_AUTO:
    color = colorBlue
    break

    case toastType.ERROR:
    color = colorRed
    break

    case toastType.ERROR_AUTO:
    color = colorRed
    break

    case toastType.ERROR_AUTO_LONG:
    color = colorRed
    break

    default:
    color = colorBlue
    break
  }
  return {
    containerId: id,
    className: css({
      background: color,
      minHeight: '54px'
    }),
    bodyClassName: css({
      fontSize: 'calc(10px + 1vmin)',
      color: '#EEE',
    }),
    progressClassName: css({
      background: '#EEE'
    })
  }
}
