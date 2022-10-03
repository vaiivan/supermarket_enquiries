from sanic import Sanic
from sanic.response import text
from sanic.response import json
from pathlib import os
from datetime import datetime
import os
import aiofiles
from ivan_label_recognize10 import handlepic

app = Sanic("AllIsRubbish")

@app.get("/")
async def hello_world(request):
    return text("Hello, world.")

@app.post("/cv2")
async def inToCv2(request):
    print("express connected")
    # if uploads does not exist, create it
    if not os.path.exists("uploads"):
        os.makedirs("uploads")
    # create a unique filepath and save the file
    file_path = os.path.join('uploads', request.form.get('applicationId') + '_' + request.files['file'][0].name)
    async with aiofiles.open(file_path, 'wb') as f:
        await f.write(request.files["file"][0].body)
    f.close()

    # call handle_pic
    final_result = handlepic(file_path, request.form.get('applicationId'))

    return json({
        "status": "success",
        "final_result":final_result,
        })

if __name__ == '__main__':
    app.run(host="127.0.0.1", port=8000)

