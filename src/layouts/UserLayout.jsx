import { getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useIntl, connect } from 'umi';
import React from 'react';
import styles from './UserLayout.less';

const UserLayout = (props) => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { formatMessage } = useIntl();
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    formatMessage,
    breadcrumb,
    ...props,
  });
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>

      <div className={styles.container}>
        <div className={styles.lang}>{/* <SelectLang /> */}</div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header} style={{ marginBottom: 30 }}>
              <div className={styles.title}>后台管理</div>
            </div>
          </div>
          {children}
        </div>
        <div style={{ textAlign: 'center' }}>
          <img src={require('../assets/ypy_logo2.png')} style={{ width: 80, height: 40 }} />
          <a target="_blank" href="https://www.upyun.com/?utm_source=lianmeng&utm_medium=referral">
            又拍云
          </a>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);
