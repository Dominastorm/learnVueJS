let app = Vue.createApp({
    data() {
      return {
        showSidebar: false,
        inventory: [],
        cart: {}
      }
    },
    computed: {
      totalQuantity() {
        return Object.values(this.cart).reduce((total, quantity) => total + quantity, 0);
      }
    },
    methods: {
      addToCart(name, i) {
        if (!this.cart[name]) {
          this.cart[name] = 0;
        } 
        this.cart[name] += this.inventory[i].quantity;
        console.log(this.cart);
        this.inventory[i].quantity = 0;
      },
      toggleSidebar() {
        this.showSidebar = !this.showSidebar;
      },
      removeItem(name) {
        delete this.cart[name];
      }
    },
    async mounted() {
      const res = await fetch('./food.json');
      const data = await res.json();
      this.inventory = data;
    }
  })
  
  app.component('sidebar', {
    props: ['toggle', 'cart', 'inventory', 'remove'],
    methods: {
      getPrice(name) {
        return this.inventory.find(product => product.name === name).price.USD;
      },
      getTotal() {
        const names = Object.keys(this.cart);
        const total =  names.reduce((total, name) => {
          return total + this.cart[name] * this.getPrice(name);
        }, 0);
        return total.toFixed(2);
      }
    },
    template: `
    <aside class="cart-container">
    <div class="cart">
      <h1 class="cart-title spread">
        <span>
          Cart
          <i class="icofont-cart-alt icofont-1x"></i>
        </span>
        <button @click="toggle" class="cart-close">&times;</button>
      </h1>

      <div class="cart-body">
        <table class="cart-table">
          <thead>
            <tr>
              <th><span class="sr-only">Product Image</span></th>
              <th>Product</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
              <th><span class="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(quantity, key, i) in cart" :key="i">
              <td><i class="icofont-carrot icofont-3x"></i></td>
              <td>{{ key }}</td>
              <td>\${{ getPrice(key) }}</td>
              <td class="center">{{ quantity }}</td>
              <td>\${{ (quantity * getPrice(key)).toFixed(2) }}</td>
              <td class="center">
                <button class="btn btn-light cart-remove" @click="remove(key)">
                  &times;
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <p class="center" v-if="!Object.keys(cart).length"><em>No items in cart</em></p>
        <div class="spread">
          <span><strong>Total:</strong> \${{ getTotal() }}</span>
          <button class="btn btn-light">Checkout</button>
        </div>
      </div>
    </div>
  </aside>
  `
  })

app.mount('#app')