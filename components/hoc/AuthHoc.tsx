import { Component } from 'react';
import Cookies from 'universal-cookie';
import Router from 'next/router';
import { CookieKeys, RouterKeys } from '../../constants/Keys';

const AuthHoc = (AuthComponent: any) => (
  class MyComponent extends Component {
    static async getInitialProps(ctx: any) {
      try {
        const { req, res } = ctx;
        const token = req.cookies[CookieKeys.userLoginToken];
        if (!token) {
          res.writeHead(302, { Location: RouterKeys.login });
          res.end();
          return {};
        }
        const initialProps = AuthComponent.getInitialProps ? await AuthComponent.getInitialProps(ctx) : {};
        return {
          ...initialProps
        };
      } catch (e) {
        return {};
      }
    }

    private readonly cookies = new Cookies();

    componentDidMount () {
      const token = this.cookies.get(CookieKeys.userLoginToken);
      if (!token) {
        Router.push(RouterKeys.login);
      }
    }

    render() {
      return <AuthComponent {...this.props} />;
    }
  }
);

export default AuthHoc;
