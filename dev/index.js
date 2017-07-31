const Vue = require('vue/dist/vue.js');
const VueResource = require('vue-resource');
const $ = require('jquery');
const _ = require('underscore');
const { shell, ipcRenderer } = require('electron');

Vue.use(VueResource);

new Vue({
  el: '.app',
  data: {
    email: '',
    loading: false,
    user: localStorage.getItem('Whodis-User'),
    auth: {
      code: null,
      show: false
    },
    data: null,
    // data: JSON.parse(localStorage.getItem('Whodis-Data')),
    error: null
  },
  mounted: () => {

  },
  watch: {
    
  },
  methods: {
    identify(e) {
      e.preventDefault();

      this.loading = true;
      this.error = null;

      // Entering auth code
      if (this.auth.show) {
        this.$http.post('https://whodis.email/api/identify', {
          email: this.email,
          auth: _.isNaN(Number(this.auth.code)) ? false : Number(this.auth.code)
        })
        .then(res => {
          localStorage.setItem('Whodis-User', res.body.user);
          this.email = '';
          this.user = res.body.user;
          this.loading = false;
        })
        .catch(err => {
          this.error = err.body.message;
          this.loading = false;
        });
      }
      
      // Still need auth code
      else {
        this.$http.post('https://whodis.email/api/identify', {
          email: this.email,
        })
        .then(res => {
          this.auth.show = true;
          this.loading = false;
        })
        .catch(err => {
          this.error = err.body.message;
          this.loading = false;
        });
      }
    },

    lookup(e) {
      e.preventDefault();

      this.loading = true;
      this.error = null;

      this.$http.get('https://whodis.email/api/lookup', {
        params: {
          email: this.email
        },
        headers: {
          'Whodis-User': this.user
        }
      })
      .then(res => {
        localStorage.setItem('Whodis-Data', JSON.stringify(res.body.data));
        this.data = res.body.data;
        this.loading = false;

        this.$nextTick(() => {
          const $last = $('.data li:last', this.$el);
          const block_h = $last.offset().top + $last.height();
          const win_h = Math.floor(screen.height * 0.75);

          ipcRenderer.send('resize', block_h > win_h ? win_h : block_h);
        });
      })
      .catch(err => {
        this.loading = false;

        if (err.status === 402) {
          this.error = `Insufficient funds, recharge your account here: <a href="${err.body.link}">${err.body.link}</a>`;

          this.$nextTick(() => {
            $('a').on('click', (e) => {
              e.preventDefault();
              shell.openExternal(err.body.link);
            });
          });
        } else {
          this.error = err.body.message;
        }
      });
    }
  }
});