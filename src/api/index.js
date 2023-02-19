import axios from "../util/request";
//登录
export async function login(loginForm) {
  return await axios.post("login", loginForm);
}

//获取菜单数据
export async function getMenus() {
  return await axios.get("menus");
}

//获取用户数据
export async function getUsers(data) {
  return await axios.get("users", { params: data });
}

//添加用户
export async function postUser(data) {
  return await axios.post("users", data);
}

//删除用户
export async function deleteUser(id) {
  return await axios.delete(`users/${id}`);
}

//编辑用户
export async function putUser(id, data) {
  return await axios.put(`users/${id}`, data);
}

//修改用户状态
export async function putState(id, type) {
  return await axios.put(`users/${id}/state/${type}`);
}

//分配角色
export async function putUserRole(id, rid) {
  return await axios.put(`users/${id}/role`, { rid });
}

//获取所有角色
export async function getRoles() {
  return await axios.get("roles");
}

//添加角色
export async function postRole(data) {
  return await axios.post("roles", data);
}

//编辑角色
export async function putRole(id, data) {
  return await axios.put(`roles/${id}`, data);
}

//删除角色
export async function deleteRole(id) {
  return await axios.delete(`roles/${id}`);
}

//获取所有权限
export async function getRights(type) {
  return await axios.get(`rights/${type}`);
}

//角色授权
export async function postRight(id, rids) {
  return await axios.post(`roles/${id}/rights`, rids);
}

//删除权限
export async function deleteRight(id, rid) {
  return await axios.delete(`roles/${id}/rights/${rid}`);
}

//获取所有商品
export async function getGoods(data) {
  return await axios.get("goods", { params: data });
}

//获取所有商品分类
export async function getGoodsCategory(data = {}) {
  return await axios.get("categories", { params: data });
}

//添加分类
export async function addCategory(data) {
  return await axios.post("categories", data);
}

//编辑分类
export async function putCategory(id, data) {
  return await axios.put(`categories/${id}`, data);
}

//删除分类
export async function deleteCategory(id) {
  return await axios.delete(`categories/${id}`);
}

//根据id获取商品参数
export async function getGoodParams(id, type) {
  return await axios.get(`categories/${id}/attributes`, {
    params: { sel: type },
  });
}

//添加商品
export async function postGood(data) {
  return await axios.post("goods", data);
}

//编辑商品
export async function putGood(id, data) {
  return await axios.put(`goods/${id}`, data);
}

//删除商品
export async function deleteGood(id) {
  return await axios.delete(`goods/${id}`);
}

//添加动态参数或静态属性
export async function postParam(id, data) {
  return await axios.post(`categories/${id}/attributes`, data);
}

//修改动态参数或静态属性
export async function putParam(id, rid, data) {
  return await axios.put(`categories/${id}/attributes/${rid}`, data);
}

//删除动态参数或静态属性
export async function deleteParam(id, rid) {
  return await axios.delete(`categories/${id}/attributes/${rid}`);
}

//获取订单数据
export async function getOrders(data) {
  return await axios.get("orders",{params:data});
}

//获取图标数据
export async function getReport(){
  return await axios.get('reports/type/1')
}
