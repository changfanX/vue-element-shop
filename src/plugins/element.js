import Vue from 'vue'
import { Form, FormItem, Input, Button, Message } from 'element-ui'

const element = [Form, FormItem, Input, Button]

for (const item of element) {
  Vue.use(item)
}

Vue.prototype.$message = Message
