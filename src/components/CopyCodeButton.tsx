import { LitElement, html, css } from 'lit'
import { copyIcon, copySuccessIcon } from './icons/copy'

export class CopyCodeButton extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
      }
      button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: fit-content;
        background: #e2e8f010;
        padding: 0.5rem;
        margin: 0;
        border: 0.05rem solid #e2e8f050;
        border-radius: 0.5rem;
        cursor: pointer;
        font-weight: 600;
      }
      button:hover {
        border: 0.05rem solid #e2e8f070;
        background: #e2e8f030;
      }
      button.isCopied {
        border: 0.05rem solid #64b75d;
      }
    `
  ]

  isCopied = false
  isActive = false

  handleClick() {
    if (this.isCopied) return
    this.isCopied = true
    let pre = this.parentElement;
    if (!pre) return
    let code = pre.querySelector('code')
    if (!code) return
    const range = document.createRange()
    range.selectNode(code)
    window.getSelection()?.removeAllRanges()
    window.getSelection()?.addRange(range)
    if (navigator.clipboard) {
      navigator.clipboard.writeText(range.toString()).then(() => {
        this.requestUpdate()
      }, () => {
          this.isCopied = false
          return
      })
    }

    window.getSelection()?.removeAllRanges()

    setTimeout(() => {
      this.isCopied = false
      this.requestUpdate()
    }, 3000)
  }

  render() {
    return html`
      <button
        class="${this.isCopied ? 'isCopied' : ''}"
        @click="${this.handleClick}"
      >
        ${this.isCopied ? copySuccessIcon : copyIcon}
      </button>
    `
  }
}

customElements.define('copy-code-button', CopyCodeButton)
