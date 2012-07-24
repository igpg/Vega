var module = {
  name : "Cookie Security Module",
  type: "response-processor",
};

function run(request, response, ctx) {
  var cookies = new Array();
  cookies=response.getHeaders("Set-Cookie");
  // FIXME: Test for SSL Missing!!!
  // so assume it is ssl until we can fix this
  var ssl=0;
  if(response.host.schemeName=="https"){
    ssl=1;
  }
  for(var i=0; i<cookies.length; i++) {
    var httponly=0;
    var secure=0;
    var params = new Array();
    params = cookies[i].getValue().split(";");
    for(var j=1; j<params.length; j++) {
      if(params[j]==" secure" || params[j]==" Secure"){
        secure=1;
      } else {
        ctx.addStringHighlight(params[j]);
      }
      if(params[j]==" httponly" || params[j]==" HttpOnly"){
        httponly=1;
      } else {
        ctx.addStringHighlight(params[j]);
      }
    }

    if(secure!=1&&ssl==1){
      ctx.alert("vinfo-cookie-secure", request, response, {
        output: cookies[i].getValue(),
        key: "vinfo-cookie-secure:" + cookies[i].getValue(),
        resource: request.requestLine.uri
      });
    }
    if(httponly!=1){
      java.lang.System.out.println("http-only");
      ctx.alert("vinfo-cookie-httponly", request, response, {
        output: cookies[i].getValue(),
        key: "vinfo-cookie-httponly:" + cookies[i].getValue(),
        resource: request.requestLine.uri
      });
    }
  }
}
