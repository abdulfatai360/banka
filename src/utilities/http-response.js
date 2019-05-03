/**
 * Contains methods for sending HTTP response to client
 *
 * @class HttpResponse
 */
class HttpResponse {
  /**
   * Send JSON representing HTTP response to client
   *
   * @static
   * @param {object} res - HTTP response object
   * @param {number} status - HTTP status code
   * @param {object} body - Result of the HTTP request-response cycle
   * @memberof HttpResponse
   */
  static send(res, status, body) {
    return res.status(status).json({ status, ...body });
  }

  /**
   * Send JSON representing HTTP response with an header to client
   *
   * @static
   * @param {object} res - HTTP response object
   * @param {object} header - Object containing header name and value
   * @param {number} status - HTTP status code
   * @param {object} body - Result of the HTTP request-response cycle
   * @memberof HttpResponse
   */
  static sendWithHeader(res, header, status, body) {
    return res.header(header.name, header.value)
      .status(status)
      .json({ status, ...body });
  }
}

export default HttpResponse;
