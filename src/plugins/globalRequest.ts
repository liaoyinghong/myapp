/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import {extend} from 'umi-request';
import {message} from "antd";
/*import {history} from "@@/core/history";
import {stringify} from "querystring";*/


/**
 * 配置request请求时的默认参数
 */
const request = extend({
  credentials: 'include', // 默认请求是否带上cookie
  //prefix:process.env.NODE_ENV === 'production' ? 'http://192.168.31.191' : undefined
  //prefix:process.env.NODE_ENV === 'production' ? 'http://124.220.199.215' : undefined
  //prefix:process.env.NODE_ENV === 'production' ? 'http://power.js.cn' : undefined
  // requestType: 'form',
});

/**
 * 所以请求拦截器
 */
request.interceptors.request.use((url, options): any => {
  console.log(`do request url = ${url}`)
  return {
    url,
    options: {
      ...options,
      headers: {},
    },
  };
});

/**
 * 所有响应拦截器
 */
request.interceptors.response.use(async (response, options): Promise<any> => {
  const res = await response.clone().json();
  if (res.code !== 0){
    message.error(res.description);
    /*history.replace({
      pathname:'/user/login',
      search:stringify({
        redirect:location.pathname,
      }),
    });*/
  }
  return res.data;
});

export default request;
