<template>
  <div v-if="open" class="backdrop" @click="hideDialog"></div>
  <transition name="modal">
    <dialog class="window" open v-if="open">
      <h5>Profile QR</h5>
      <hr>
      <div class="w-100 d-flex">
        <qrcode-vue class="mx-auto" :value="url" :size="280" level="H" />
      </div>
<!--      copy code button-->
      <div class="d-grid mt-3 gap-2">
        <div class="row g-3">
          <div class="col-6">
            <button class="btn w-100 btn-primary" @click="copyToClipboard">{{ $t("login.copyCode") }} <i class="fa fa-copy"></i></button>
          </div>
          <div class="col-6">
            <router-link :to="'user/' + userID" class="btn w-100 btn-primary">{{ $t("login.viewProfile") }}</router-link>
          </div>
        </div>
        <div class="text-success" role="alert" v-if="copied">
          {{ $t("login.copied") }}
        </div>
      </div>
      <div class="d-grid mt-3 gap-2">
        <button class="btn btn-dark" @click="hideDialog">{{ $t("login.close") }}</button>
      </div>
    </dialog>
  </transition>
</template>

<script>
import QrcodeVue from 'qrcode.vue'
export default {
  props:
  {
    open: {
      type: Boolean,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    userID: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      copied: false,
    };
  },
  components: {
    QrcodeVue,
  },
  emits: ['close'],
  methods: {
    hideDialog() {
      this.$emit('close');
    },
    copyToClipboard() {
      this.copied = true;
      const el = document.createElement('textarea');
      el.value = this.url;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    },
  },
};
</script>

<style scoped>
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.75);
}

.window {
  max-width: 450px;
}

dialog {
  position: fixed;
  top: 10%;
  max-height: 80%;
  max-width: 600px;
  overflow: auto;
  width: 90%;
  margin: 0 auto;
  bottom: 20vh;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  border-radius: 0;
  padding: 1rem;
  background-color: white;
  z-index: 100;
  border: none;
  /*animation: modal 0.5s ease-out forwards;*/
}

.flash {
  animation: flash 0.6s infinite;
}

.table-sm td, .table-sm th {
  padding-top: 0!important;
  padding-bottom: 0!important;
}

@keyframes flash {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}

.modal-enter-active {
  animation: modal 0.3s ease-out;
}

.modal-leave-active {
  animation: modal 0.3s ease-in reverse;
}

@keyframes modal {
  from {
    opacity: 0;
    transform: scale(0.75);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>