function stop = dbStopFunction(info,taskid,maxIterations)

stop = false;
check_frequency = 5;
global metadata;
metadata = info;
if(mod(info.Iteration,check_frequency)==0)
    conn = dbconn();
    query = strcat('SELECT tasks.id,tasks.owner,tasks.type,tasks.status,tasks.data,tasks.model,tasks.worker,data.location FROM ( brain.tasks INNER JOIN brain.data ON tasks.data = data.id) where tasks.id = ',int2str(taskid),' limit 1;');
    task = fetch(conn,query);
    if (strcmp (task.status{1},'stopped') || info.Iteration>maxIterations)
        stop = true;
    end
    
    query = strcat('update tasks set percentage = ',int2str(100*min(info.Iteration,maxIterations)/maxIterations),' where id = ',int2str(taskid),';');
    execute(conn,query);
    close(conn)
    
end

end