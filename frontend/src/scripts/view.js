/**
 * Hello Sift Sift. Frontend view entry point.
 */

import { SiftView, registerSiftView } from '@redsift/sift-sdk-web';

export default class MyView extends SiftView {
  constructor() {
    // You have to call the super() method to initialize the base class.
    super();
    this.controller.subscribe('settings', this.onSettings.bind(this));
    this.controller.subscribe(
      'bot_configured',
      this.onBotConfigured.bind(this)
    );
    window.addEventListener('load', this.formHandler.bind(this));

    this.showSlackAuthUI = this.showSlackAuthUI.bind(this);
  }

  showSlackAuthUI() {
    console.log('showSlackAuthUI called');

    const topic = 'showSlackAuth';
    const value = {};

    this._proxy.postMessage(
      {
        method: 'notifyClient',
        params: {
          topic: topic,
          value: value,
        },
      },
      '*'
    );
  }

  // for more info: http://docs.redsift.com/docs/client-code-siftview
  presentView(value) {
    console.log('scrumbot-sift: presentView: ', value.data.settings.tz);
    $('select[name=tz]').val(value.data.settings.tz);
    $('.selectpicker').selectpicker('refresh');
    $('select[name=start-of-day]').val(value.data.settings.startOfDay);
    $('.selectpicker').selectpicker('refresh');
    $('select[name=meeting-call').val(value.data.settings.meetingCall);
    $('.selectpicker').selectpicker('refresh');

    const { bot_configured } = value;

    this.setupUI({ bot_configured });
  }

  formHandler() {
    let that = this;
    document
      .getElementById('settings-form')
      .addEventListener('submit', function(e) {
        console.log('SUBMIT ', e);
        e.preventDefault();
        let form = document.forms[0];
        let start = form['start-of-day'].value;
        let call = form['meeting-call'].value;
        if (parseInt(call) < parseInt(start)) {
          alert('Meeting call time must be the same as or after start of day');
        } else {
          that.publish('wpm', {
            tz: form.tz.value,
            startOfDay: start,
            meetingCall: call,
          });
        }
      });
  }

  willPresentView(value) {
    console.log('hello-sift: willPresentView: ', value);
  }

  setupUI({ bot_configured }) {
    if (bot_configured) {
      $('#configured').css('display', 'block');
      $('#notConfigured').css('display', 'none');
    } else {
      document.querySelector('#signupBtn').addEventListener('click', e => {
        console.log('clicked connect button');
        this.showSlackAuthUI();
      });

      $('#configured').css('display', 'none');
      $('#notConfigured').css('display', 'flex');
    }
  }

  onSettings(data) {
    let settings = data;
    console.log('scrumbot: onSettings view: ', settings);
    $('select[name=tz]').val(settings.tz);
    $('.selectpicker').selectpicker('refresh');
    $('select[name=start-of-day]').val(parseInt(settings.startOfDay));
    $('.selectpicker').selectpicker('refresh');
    $('select[name=meeting-call').val(parseInt(settings.meetingCall));
    $('.selectpicker').selectpicker('refresh');
  }

  onBotConfigured(bot_configured) {
    console.log('scrumbot: onBotConfigured view: ', bot_configured);

    this.setupUI({ bot_configured });
  }
}

registerSiftView(new MyView(window));
