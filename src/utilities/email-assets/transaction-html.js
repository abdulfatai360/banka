const transactionEmailHtml = /* html */`
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" style="box-sizing: inherit; border: 0; font-size: 100%; font: inherit; vertical-align: baseline; outline: 0; line-height: inherit; margin: 0; padding: 0;">
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <title>Banka eMail Notification Service</title>

  
</head>

<body style="border: 0; font-size: 100%; font: inherit; vertical-align: baseline; outline: 0; line-height: inherit; width: 100%; height: 100%; margin: 0; padding: 0; box-sizing: border-box; color: #14213d; min-width: 100%;">
  <div class="root" style="border: 0; font: inherit; vertical-align: baseline; outline: 0; line-height: inherit; box-sizing: border-box; width: 100%; margin: 0; padding: 0; color: #14213d; font-size: 62.5%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
    <div class="container" style="box-sizing: inherit; padding: 0; border: 0; font: inherit; vertical-align: baseline; outline: 0; line-height: inherit; width: 100%; max-width: 600px; margin: 0 auto; font-size: 1.6em;">
      <div class="header" style="box-sizing: inherit; margin: 0; border: 0; font: inherit; vertical-align: baseline; outline: 0; line-height: inherit; padding: 33px 15px 22px 15px; background: #14213d; color: #fff; text-align: center; font-size: 3em;">
        <p class="h1" style="box-sizing: inherit; margin: 0; border: 0; font-size: 100%; font: inherit; vertical-align: baseline; outline: 0; line-height: 0.9; text-align: center; font-weight: bold; display: inline-block; color: #fca311; padding: 15px; margin-bottom: 0.2em; font-family: 'Pacifico', cursive;">Banka</p>
      </div>

      <div class="row" style="box-sizing: inherit; margin: 0; border: 0; font: inherit; vertical-align: baseline; outline: 0; line-height: inherit; color: #14213d; font-size: 1em; padding: 33px 15px 11px 15px;">
        <p style="box-sizing: inherit; margin: 0; padding: 0; border: 0; font-size: 100%; font: inherit; vertical-align: baseline; outline: 0; line-height: inherit; margin-bottom: 1em;">Dear <strong style="box-sizing: inherit; margin: 0; padding: 0; border: 0; font-size: 100%; font: inherit; vertical-align: baseline; outline: 0; line-height: inherit; font-weight: bold;">{{accountName}},</strong></p>

        <p class="h2" style="box-sizing: inherit; margin: 0; padding: 0; border: 0; font: inherit; vertical-align: baseline; outline: 0; line-height: inherit; font-weight: bold; font-size: 1.1em; margin-bottom: 1em;">Banka eMail Notification Service</p>
        
        <p style="box-sizing: inherit; margin: 0; padding: 0; border: 0; font-size: 100%; font: inherit; vertical-align: baseline; outline: 0; line-height: inherit; margin-bottom: 1em;">We wish to inform you that a {{type}} transaction occured on your account with us.</p>
        
        <p style="box-sizing: inherit; margin: 0; padding: 0; border: 0; font-size: 100%; font: inherit; vertical-align: baseline; outline: 0; line-height: inherit; margin-bottom: 1em;">The details of this transaction are shown below:</p>
      </div>

      <div class="row txn-details" style="box-sizing: inherit; margin: 0; border: 0; font: inherit; vertical-align: baseline; outline: 0; line-height: inherit; color: #14213d; font-size: 1em; padding: 33px 15px 11px 15px;">
        <div class="h2" style="box-sizing: inherit; margin: 0; padding: 0; border: 0; font: inherit; vertical-align: baseline; outline: 0; line-height: inherit; font-weight: bold; font-size: 1.1em; margin-bottom: 1em;">Transaction Details</div>
      
        <table style="box-sizing: inherit; margin: 0; padding: 0; border: 0; font: inherit; vertical-align: baseline; outline: 0; line-height: inherit; width: 100%; border-collapse: collapse; border-spacing: 0; font-size: 1em;" width="100%" valign="baseline">
          <tbody style="box-sizing: inherit; margin: 0; padding: 0; border: 0; font-size: 100%; font: inherit; vertical-align: baseline; outline: 0; line-height: inherit;" valign="baseline">
            <tr style="box-sizing: inherit; margin: 0; padding: 0; border: 0; font-size: 100%; font: inherit; vertical-align: baseline; outline: 0; line-height: inherit;" valign="baseline">
              <th style="box-sizing: inherit; margin: 0; padding: 0; border: 0; font-size: 100%; font: inherit; outline: 0; line-height: inherit; vertical-align: middle; padding-right: 7px; color: #3e5891; font-weight: 700; text-align: left; padding-top: 12px; padding-bottom: 12px; border-top: 1px solid #e5e5e5; padding-left: 7px;" align="left" valign="middle">Account Number</th>
              <td style="box-sizing: inherit; margin: 0; padding: 0; border: 0; font-size: 100%; font: inherit; outline: 0; line-height: inherit; vertical-align: middle; padding-right: 7px; padding-top: 12px; padding-bottom: 12px; border-top: 1px solid #e5e5e5; padding-left: 7px;" valign="middle">{{accountNumber}}</td>
            </tr>
            <tr style="box-sizing: inherit; margin: 0; padding: 0; border: 0; font-size: 100%; font: inherit; vertical-align: baseline; outline: 0; line-height: inherit; background: #e5e5e5;" valign="baseline">
              <th style="box-sizing: inherit; margin: 0; padding: 0; border: 0; font-size: 100%; font: inherit; outline: 0; line-height: inherit; vertical-align: middle; padding-right: 7px; color: #3e5891; font-weight: 700; text-align: left; padding-top: 12px; padding-bottom: 12px; border-top: 1px solid #e5e5e5; padding-left: 7px;" align="left" valign="middle">Amount</th>
              <td style="box-sizing: inherit; margin: 0; padding: 0; border: 0; font-size: 100%; font: inherit; outline: 0; line-height: inherit; vertical-align: middle; padding-right: 7px; padding-top: 12px; padding-bottom: 12px; border-top: 1px solid #e5e5e5; padding-left: 7px;" valign="middle">{{amount}}</td>
            </tr>
            <tr style="box-sizing: inherit; margin: 0; padding: 0; border: 0; font-size: 100%; font: inherit; vertical-align: baseline; outline: 0; line-height: inherit;" valign="baseline">
              <th style="box-sizing: inherit; margin: 0; padding: 0; border: 0; font-size: 100%; font: inherit; outline: 0; line-height: inherit; vertical-align: middle; padding-right: 7px; color: #3e5891; font-weight: 700; text-align: left; padding-top: 12px; padding-bottom: 12px; border-top: 1px solid #e5e5e5; padding-left: 7px;" align="left" valign="middle">Date</th>
              <td style="box-sizing: inherit; margin: 0; padding: 0; border: 0; font-size: 100%; font: inherit; outline: 0; line-height: inherit; vertical-align: middle; padding-right: 7px; padding-top: 12px; padding-bottom: 12px; border-top: 1px solid #e5e5e5; padding-left: 7px;" valign="middle">{{date}}</td>
            </tr>
            <tr style="box-sizing: inherit; margin: 0; padding: 0; border: 0; font-size: 100%; font: inherit; vertical-align: baseline; outline: 0; line-height: inherit; background: #e5e5e5;" valign="baseline">
              <th style="box-sizing: inherit; margin: 0; padding: 0; border: 0; font-size: 100%; font: inherit; outline: 0; line-height: inherit; vertical-align: middle; padding-right: 7px; color: #3e5891; font-weight: 700; text-align: left; padding-top: 12px; padding-bottom: 12px; border-top: 1px solid #e5e5e5; padding-left: 7px;" align="left" valign="middle">Time</th>
              <td style="box-sizing: inherit; margin: 0; padding: 0; border: 0; font-size: 100%; font: inherit; outline: 0; line-height: inherit; vertical-align: middle; padding-right: 7px; padding-top: 12px; padding-bottom: 12px; border-top: 1px solid #e5e5e5; padding-left: 7px;" valign="middle">{{time}}</td>
            </tr>
            <tr style="box-sizing: inherit; margin: 0; padding: 0; border: 0; font-size: 100%; font: inherit; vertical-align: baseline; outline: 0; line-height: inherit;" valign="baseline">
              <th style="box-sizing: inherit; margin: 0; padding: 0; border: 0; font-size: 100%; font: inherit; outline: 0; line-height: inherit; vertical-align: middle; padding-right: 7px; color: #3e5891; font-weight: 700; text-align: left; padding-top: 12px; padding-bottom: 12px; border-top: 1px solid #e5e5e5; padding-left: 7px;" align="left" valign="middle">Current Balance</th>
              <td style="box-sizing: inherit; margin: 0; padding: 0; border: 0; font-size: 100%; font: inherit; outline: 0; line-height: inherit; vertical-align: middle; padding-right: 7px; padding-top: 12px; padding-bottom: 12px; border-top: 1px solid #e5e5e5; padding-left: 7px;" valign="middle">{{currentBal}}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="row" style="box-sizing: inherit; margin: 0; border: 0; font: inherit; vertical-align: baseline; outline: 0; line-height: inherit; color: #14213d; font-size: 1em; padding: 33px 15px 11px 15px;">
        <p style="box-sizing: inherit; margin: 0; padding: 0; border: 0; font-size: 100%; font: inherit; vertical-align: baseline; outline: 0; line-height: inherit; margin-bottom: 1em;">Thank you for choosing Banka</p>
      </div>

      <div class="footer" style="box-sizing: inherit; margin: 0; border: 0; font: inherit; vertical-align: baseline; outline: 0; line-height: inherit; background: #14213d; color: #fff; text-align: center; font-size: 1em; padding: 33px 15px 22px 15px;">
        To view your accounts and transaction details, log in to <a href="https://abdulfatai360.github.io/banka/ui/signin.html" style="box-sizing: inherit; margin: 0; padding: 0; border: 0; font-size: 100%; font: inherit; vertical-align: baseline; outline: 0; line-height: inherit; color: #fca311; cursor: pointer;">your dashboard</a> on our website
      </div>
    </div>
  </div>
</body>
</html>
`;

export default transactionEmailHtml;
