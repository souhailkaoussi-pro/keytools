import React, { Component } from 'react'
import * as nano from 'nanocurrency'
import { InputGroup, FormControl, Button} from 'react-bootstrap'
import QrImageStyle from '../modules/qrImageStyle'
import * as helpers from '../helpers'
import './PaymentTool.css';
import MainPage from '../mainPage'
import $ from 'jquery'

class PaymentTool extends Component {
  constructor(props) {
    super(props)

    this.state = {
      address: '',
      amount: '',
      validAddress: false,
      validAmount: false,
      qrContent: '',
      qrSize: 512,
    }

    this.handleAddressChange = this.handleAddressChange.bind(this)
    this.handleAmountChange = this.handleAmountChange.bind(this)
    this.clearText = this.clearText.bind(this)
    this.sample = this.sample.bind(this)
    this.updateQR = this.updateQR.bind(this)
  }

  //Clear text from input field
  clearText(event) {
    switch(event.target.value) {
      case 'address':
        this.setState({
          address: '',
          validAddress: false
        },
        function() {
          this.updateQR()
        })
        break
      case 'amount':
        this.setState({
          amount: '',
          validAmount: false
        },
        function() {
          this.updateQR()
        })
        break
      default:
        break
    }
  }

  handleAddressChange(event) {
    this.addressChange(event.target.value)
  }

  addressChange(address) {
    if (!nano.checkAddress(address)) {
      if (address !== '') {
        new MainPage().notifyInvalidFormat()
      }
      this.setState({
        address: address,
        validAddress: false
      })
      return
    }
    this.setState({
      address: address,
      validAddress: true
    },
    function() {
      this.updateQR()
    })
  }

  handleAmountChange(event) {
    this.amountChange(event.target.value)
  }

  amountChange(amount) {
    let raw = helpers.MnanoToRaw(amount)
    // allow no amount
    if (!nano.checkAmount(raw) && amount !== '') {
      new MainPage().notifyInvalidFormat()
      this.setState({
        amount: amount,
        validAmount: false
      })
      return
    }
    this.setState({
      amount: amount,
      validAmount: true,
    },
    function() {
      this.updateQR()
    })
  }

  updateQR() {
    let address = this.state.address
    let amount = this.state.amount
    var raw = ''
    var url = ''

    // allow both address and amount, or only address
    if (address !== '' && amount !== '') {
      raw = helpers.MnanoToRaw(this.state.amount)
      url = 'nano:' + this.state.address + '?amount=' + raw
    }
    else if (address !== ''){
      url = 'nano:' + address
    }
    else {
      url = '#'
    }

    var qr
    if (url === '#') {
      qr = ''
    }
    else {
      qr = url
    }

    this.setState({
      qrContent: qr
    })

    // update wallet button
    $('#wallet-btn').attr("href", url)
  }

  sample() {
    this.setState({
      address: helpers.constants.SAMPLE_PAYMENT_ADDRESS,
      validAddress: true,
      amount: '0.1',
      validAmount: true,
    },
    function() {
      this.updateQR()
    })
  }

  print() {
    window.print()
  }

  render() {
    return (
      <div>
        <div className="noprint">
          <p>Generate payment card or Pay Now with an ADDRESS and optional NANO amount</p>
          <ul>
            <li>Scan QR with a wallet. The amount is included</li>
            <li>Open in Wallet may work depending on wallet installed</li>
            <li>The link in the URL bar can be shared with anyone</li>
            <li>Right click and save QR image to embed on any site or print it</li>
          </ul>
        </div>
        <div className="noprint">
          <InputGroup size="sm" className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="address">
                Address
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl id="address" aria-describedby="address" value={this.state.address} title="Payment address. xrb_ or nano_ prefix." placeholder="nano_xxx... or xrb_xxx..." onChange={this.handleAddressChange.bind(this)}/>
            <InputGroup.Append>
              <Button variant="outline-secondary" className="fas fa-times-circle" value='address' onClick={this.clearText.bind(this)}></Button>
              <Button variant="outline-secondary" className="fas fa-copy" value={this.state.address} onClick={helpers.copyText.bind(this)}></Button>
            </InputGroup.Append>
          </InputGroup>

          <InputGroup size="sm" className="mb-3 index-input">
            <InputGroup.Prepend>
              <InputGroup.Text id="amount">
                NANO
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl id="amount" aria-describedby="amount" value={this.state.amount} title="Payment amount in NANO" onChange={this.handleAmountChange.bind(this)}/>
            <InputGroup.Append>
              <Button variant="outline-secondary" className="fas fa-times-circle" value='amount' onClick={this.clearText.bind(this)}></Button>
              <Button variant="outline-secondary" className="fas fa-copy" value={this.state.amount} onClick={helpers.copyText.bind(this)}></Button>
            </InputGroup.Append>
          </InputGroup>

          <Button variant="primary" onClick={this.sample}>Sample</Button>
          <a className="btn btn-primary" id="wallet-btn" href="https://keytools.nanos.cc" role="button">Open in Wallet</a>
          <Button variant="primary" onClick={this.print}>Print</Button>
        </div>
        <div className="QR-container-payment">
          <QrImageStyle className="QR-img-payment" content={this.state.qrContent} size={this.state.qrSize} />
        </div>
      </div>
    )
  }
}
export default PaymentTool