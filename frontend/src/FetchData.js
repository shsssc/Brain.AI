const backUrl = "http://144.202.105.126:8080/";

function getToken() {
  return localStorage.getItem("token");
}

export const resolveJSON = (response) => {
  if (!response.ok) throw new Error("invalid");
  return response.json();
};

export function getDataList() {
  return fetch(backUrl + "data?session_token=" + localStorage.getItem("token")).then(resolveJSON).then(
    (data) =>
      data.map(item => [item.id, item.name,
        item.type === "training" ? "Training Set" : (item.type === "prediction" ? "Prediction Set" : "Under Processing"),
        item.preview, item.location])
  );
}

export function getModelList() {
  return fetch(backUrl + "models?session_token=" + localStorage.getItem("token")).then(resolveJSON).then(
    (data) =>
      data.map(item => [item.id, item.name, item.shared, (item.owner == localStorage.getItem("id")), item.metadata])
  );
}

export function getTaskList() {
  return fetch(backUrl + "task?session_token=" + localStorage.getItem("token")).then(resolveJSON).then(
    (data) =>
      data.map(item => [item.id, item.type, item.status, item.data, (item.model === null ? "/" : item.model), item.percentage]).filter(item => item[1] !== "preview")
  );
}

export function signIn(email, password) {
  const params = new URLSearchParams({
    "email": email,
    "password": password
  });
  return fetch(backUrl + "session?" + params.toString(), {
    method: "POST"
  }).then(resolveJSON).then((data) => {
    console.log(JSON.stringify(data));
    localStorage.setItem("token", data.user_token);
    localStorage.setItem("id", data.user_id);
    localStorage.setItem("email", email);
    window.location.href = "/";
  })
}

export function signUp(email, password) {
  const params = new URLSearchParams({
    "email": email,
    "password": password
  });
  return fetch(backUrl + "user?" + params.toString(), {
    method: "POST"
  }).then(resolveJSON);
}

export function signOut(token) {
  return fetch(backUrl + "session?session_token=" + token, {method: "DELETE"}).then(resolveJSON);
}

export function uploadData(name, file) {
  var dataId = -1;
  return fetch(backUrl + `data?name=${name}&session_token=${getToken()}`,
    {method: "POST"}).then(resolveJSON).then((data) => {
    dataId = data.data_id;
    return fetch(data.upload_url, {
      headers: {"Content-Type": "application/octet-stream"}, method: "PUT", body: file
    })
  }).then(() => createTask("preview", dataId));
}

export function deleteData(dataId) {
  return fetch(backUrl + `data?data_id=${dataId}&session_token=${getToken()}`, {method: "DELETE"});
}

export function deleteModel(modelId) {
  return fetch(backUrl + `models?model_id=${modelId}&session_token=${getToken()}`, {method: "DELETE"});
}

export function deleteTask(taskId) {
  return fetch(backUrl + `task?task_id=${taskId}&session_token=${getToken()}`, {method: "DELETE"});
}

export function stopTask(taskId) {
  return fetch(backUrl + `task?task_id=${taskId}&session_token=${getToken()}`, {method: "PUT"});
}

export function shareModel(modelId, share) {
  return fetch(backUrl + `models?model_id=${modelId}&session_token=${getToken()}&shared=${share}`, {method: "PUT"});
}

export function renameModel(modelId, name) {
  return fetch(backUrl + `models?model_id=${modelId}&session_token=${getToken()}&name=${name}`, {method: "PUT"});
}

export function createTask(type, dataId, modelId) {
  const params = JSON.parse(JSON.stringify({
    "session_token": getToken(),
    "type": type,
    "data": dataId,
    "model": modelId
  }));
  return fetch(backUrl + "task?" + new URLSearchParams(params).toString(), {method: "POST"}).then(resolveJSON);
}
