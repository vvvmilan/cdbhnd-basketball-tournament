import React from 'react';
import Group from "./Group.jsx";
import groups from "../data/groups.json"


const GroupsList = () => {
  return (
      <div>
        <div id="groups-list" className="flex flex-col justify-center my-12 gap-x-8">
          <div className="mb-8"><h2 className="text-center">Group stage</h2></div>
          <div className="flex justify-center gap-x-8">
            {Object.keys(groups).map(groupKey => (
                <Group groupName={groupKey}/>
            ))}
          </div>

        </div>
      </div>

  );
}

export default GroupsList;