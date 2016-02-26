import qs from 'query-string';

export default (params) => {
  if (!params) {
    return {
      endpoint: '',
      key: 'DEFAULT_KEY'
    };
  }

  const endpoint = typeof params === 'object' ? `?${qs.stringify(params)}` : `/${params}`;

  return {
    endpoint,
    key: endpoint.slice(1)
  };
};
