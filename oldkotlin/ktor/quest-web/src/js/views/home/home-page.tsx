import React, {useEffect, useState} from "react";
import SFXLayout from "@/js/views/layout/Layout";
import SFXHeader from "@/js/views/layout/Header";
import NavMenu from "@/js/views/layout/partial/NavMenu";
import {getJsonData, getXmlData} from "@/services/utils/helpers";
import {PrimaryButton, Stack, TextField} from "@fluentui/react";
import {css} from "@emotion/css";
import UserMenu from "@/js/views/layout/partial/UserMenu";
import {questPost, questQuery} from "@/services/some/quest";

const useHeader = () => {
    return <SFXHeader start={<NavMenu/>} end={<UserMenu/>}/>
}

const itemStyles = css`
  padding: 8px;
`

const dateStyles = css`
  color: #a5a5a5;
  margin-top: 8px;
`

const titleStyles = css`
  font-size: 24px;
  text-decoration: none;
  color: #000;
`

export default function HomePage() {
    const [quest, setQuest] = useState('');
    const [list, setList] = useState<Quest[]>([]);
    useEffect(() => {
        questQuery({}).then((out) => {
            console.log('HomePage questQuery', out);
            if (!out || !out.rows || out.count < 1) {
                return;
            }
            setList(out.rows);
        });
    }, []);
    const listItems = list.map((o) =>
        <Stack.Item key={o.pk} className={itemStyles}>
            <div>
                <a href={'/post/read/' + o.pk} className={titleStyles}>
                    {o.title}
                </a>
            </div>
            <div className={dateStyles}>
                <span>{o.update_time.toLocaleString()}</span>
            </div>
        </Stack.Item>
    );
    return <SFXLayout header={useHeader()} footer={<span></span>}>
            <div className="ms-Grid" dir="ltr">
                <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-sm12 ms-xl12">
                        <Stack tokens={{childrenGap: 8}}>
                            <Stack.Item>
                                <TextField value={quest} onChange={(event, value) => {
                                    if(!value) {
                                        return;
                                    }
                                    setQuest(value);
                                }} />
                            </Stack.Item>
                            <Stack.Item>
                                <PrimaryButton onClick={()=>{
                                    console.log('发布');
                                    const postData = {
                                        title: quest,
                                    }
                                    questPost(postData).then((out)=>{
                                        console.log("ok", out);
                                        if(out && out.pk) {
                                            window.location.href = '/';
                                        }
                                    })
                                }}>发布</PrimaryButton>
                            </Stack.Item>
                        </Stack>
                    </div>
                </div>
                <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-sm12 ms-xl12">
                        <Stack tokens={{childrenGap: 8}}>
                            {listItems}
                        </Stack>
                    </div>
                </div>
            </div>
    </SFXLayout>
}
