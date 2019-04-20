class HttpResponse {
  static send(res, status, body = {}) {
    res.status(status).json({ status, ...body });
  }

  static sendWithHeader(res, header, status, body) {
    res.header(header.name, header.value)
      .status(status)
      .json({ status, ...body });
  }
}

export default HttpResponse;
