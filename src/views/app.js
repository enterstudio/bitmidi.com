const { Component, h } = require('preact') /** @jsx h */
const throttle = require('throttleit')

const config = require('../../config')
const routes = require('../routes')

const Header = require('./header')
const Footer = require('./footer')
const Title = require('./title')

class App extends Component {
  constructor () {
    super()
    this.onResizeThrottled = throttle(this.onResize, 500)
  }

  componentDidMount () {
    if (config.isBrowser) {
      this.onResize()
      window.addEventListener('resize', this.onResizeThrottled)
    }
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.onResizeThrottled)
  }

  render (props) {
    const { store } = this.context
    const { app, location, errors } = store

    const Page = routes.find(route => route[0] === location.name)[2]

    return (
      <div id='app'>
        <Title title={app.title} />
        <Header />
        <div class='mt4 pa2 pa3-m pa3-l mw7 center'>
          <Page />
          {errors.map(err => <small>{err}</small>)}
          <Footer />
        </div>
      </div>
    )
  }

  onResize = () => {
    const { dispatch } = this.context
    const width = window.innerWidth
    const height = window.innerHeight
    dispatch('APP_RESIZE', { width, height })
  }
}

module.exports = App
