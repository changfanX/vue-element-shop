import Vue from 'vue'
import {
  MessageBox,
  Message,
  Form,
  FormItem,
  Input,
  Button,
  Container,
  Header,
  Aside,
  Main,
  RadioGroup,
  RadioButton,
  Menu,
  Submenu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Table,
  TableColumn,
  Row,
  Col,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  Select,
  Option
} from 'element-ui'

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
const element = [
  Form,
  FormItem,
  Input,
  Button,
  Container,
  Header,
  Aside,
  Main,
  RadioGroup,
  RadioButton,
  Menu,
  Submenu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Table,
  TableColumn,
  Row,
  Col,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  Select,
  Option
]

for (const item of element) {
  Vue.use(item)
}
