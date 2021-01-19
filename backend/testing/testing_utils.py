# testing_utils
from box import Box

def test_function(response):
    return Box({"test_model_id": response.json()[0]["id"]})

def message_updated_model (response):
    m = response.json()[0]
    assert m.get("id") == 6
    assert m.get("shared") == 0
    assert m.get("name") == "newnewnew"

def message_created_task (response, user_id, data_id, model_id):
    for m in response.json():
        if m.get("owner") == int(user_id):
            if m.get("type") != "training":
                continue
            if m.get("data") != int(data_id):
                continue
            if m.get("model") != int(model_id):
                continue
            return Box({"test_task_id": m["id"]})
    assert False

def message_deleted_task (response, task_id):
    for m in response.json():
        assert m.get("id") != int(task_id)
