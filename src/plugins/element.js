import Vue from 'vue'
import { Form, FormItem, Input, Button, Message, Container, Header, Aside, Main, RadioGroup, RadioButton, Menu, Submenu, MenuItem } from 'element-ui'

const element = [Form, FormItem, Input, Button, Container, Header, Aside, Main, RadioGroup, RadioButton, Menu, Submenu, MenuItem]

for (const item of element) {
  Vue.use(item)
}

Vue.prototype.$message = Message
