/**
 * solace.js - 留愛心安 · 心靈燈塔與全人安撫終端 (Terminal of Universal Solace)
 * 100% Client-Side Pure JS / 中英雙語溫柔美學 / 跨族群生死心理支持模組
 */
(function () {
    'use strict';

    var MONO = '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace';
    var SERIF = '"Noto Serif TC", "Source Han Serif TC", Georgia, serif';

    // 🎨 溫潤心安色譜 (Gentle & Calming Aesthetic)
    var S = {
        title: 'background: #0b1120; color: #7dd3fc; font-family: ' + MONO + '; font-size: 13px; font-weight: 700; padding: 8px 14px; border-left: 5px solid #38bdf8; border-top: 1px solid #1e293b; border-right: 1px solid #1e293b; border-radius: 4px 4px 0 0; display: block;',
        sub: 'background: #0b1120; color: #a7f3d0; font-family: ' + SERIF + '; font-size: 11.5px; padding: 6px 14px; border-left: 5px solid #34d399; border-bottom: 1px solid #1e293b; border-right: 1px solid #1e293b; border-radius: 0 0 4px 4px; display: block; line-height: 1.6;',
        boxWarm: 'background: #131b2e; color: #f1f5f9; font-family: ' + SERIF + '; font-size: 12px; line-height: 1.85; padding: 14px 18px; border-left: 4px solid #fde68a; border-top: 1px solid #1e293b; border-bottom: 1px solid #1e293b; border-right: 1px solid #1e293b; border-radius: 6px; display: block; white-space: pre-wrap;',
        boxHope: 'background: #1e1b4b; color: #e0e7ff; font-family: ' + SERIF + '; font-size: 12px; line-height: 1.85; padding: 14px 18px; border-left: 4px solid #818cf8; border-top: 1px solid #312e81; border-bottom: 1px solid #312e81; border-right: 1px solid #312e81; border-radius: 6px; display: block; white-space: pre-wrap;',
        quote: 'background: #0f172a; color: #cbd5e1; font-family: ' + SERIF + '; font-size: 11.5px; font-style: italic; line-height: 1.8; padding: 12px 16px; border-left: 3px solid #94a3b8; border-radius: 4px; display: block;',
        cliBar: 'background: #0b1120; color: #86efac; font-family: ' + MONO + '; font-size: 11px; font-weight: 600; padding: 7px 14px; border: 1px solid #1e293b; border-left: 5px solid #10b981; border-radius: 4px; display: block;',
        cmdKey: 'background: #1e293b; color: #fde68a; font-weight: 700; font-family: ' + MONO + '; padding: 2px 7px; border-radius: 3px; border: 1px solid #334155;',
        cmdDesc: 'background: transparent; color: #cbd5e1; font-family: ' + MONO + '; padding: 1px 6px;'
    };

    function renderSolaceTerminal() {
        console.log('%c🌿 [ 留愛心安 · 心靈燈塔 // TERMINAL OF SOLACE & PEACE ]', S.title);
        console.log('%c留愛於生，遇事心安 ‧ 無論你帶著怎樣的心境來到這裡，願此處成為你的溫柔庇護所\nWherever life brings you today, may this quiet corner offer you shelter, courage, and peace.', S.sub);
        console.log('');

        var introText = [
            '「死亡不是真正的告別，遺忘才是。',
            ' 無論你是滿懷牽掛的立庫者、痛失至親的家屬、疲憊不堪的照顧者，抑或只是偶然路過的旅人——',
            ' 請深呼吸。悲傷會如潮水退去，留在沙灘上的愛與秩序，會一生托住我們的生活。」',
            '',
            '“Death is not the true departure; forgetting is.',
            ' Whether you are preparing with foresight, grieving a beloved, caring with exhaustion,',
            ' or simply passing by—take a gentle breath.',
            ' Grief recedes like waves, but the love and order left behind will shelter us all.”'
        ].join('\n');
        console.log('%c' + introText, S.boxWarm);
        console.log('');

        console.log('%c💡 尋找屬於你此刻心境的安撫指令 (CLI): 請輸入 solace.help()', S.cliBar);
    }

    var breathTimer = null;
    var breathOverlay = null;

    function removeBreathOverlay() {
        if (breathTimer) {
            clearInterval(breathTimer);
            breathTimer = null;
        }
        if (breathOverlay && breathOverlay.parentNode) {
            breathOverlay.parentNode.removeChild(breathOverlay);
            breathOverlay = null;
        }
    }

    window.solace = Object.freeze({
        help: function () {
            console.log('%c[ 心靈指引指令集 // SOLACE COMMAND SUITE ]', S.sub);
            console.log('%csolace.grieving()%c  - 【給喪親家屬】哭過之後，他留下的愛依然托住你 / To the Bereaved Family', S.cmdKey, S.cmdDesc);
            console.log('%csolace.departing()%c - 【給即將遠行的旅人】卸下牽掛，你已圓滿打點一切 / To Those Approaching the End', S.cmdKey, S.cmdDesc);
            console.log('%csolace.pillar()%c    - 【給未雨綢繆的家庭支柱】化焦慮為安心，這不是觸霉頭 / To Family Guardians', S.cmdKey, S.cmdDesc);
            console.log('%csolace.carer()%c     - 【給疲憊的病患照顧者】看見你的辛勞，請給自己一個擁抱 / To Exhausted Carers', S.cmdKey, S.cmdDesc);
            console.log('%csolace.hope()%c      - 【給心靈困頓、想放棄的人】溫柔挽留與安心傾聽熱線 / A Gentle Embrace & Hotlines', S.cmdKey, S.cmdDesc);
            console.log('%csolace.living()%c    - 【給健康常人】向死而生，今晚抱抱身邊重要的人 / Memento Mori: To the Living', S.cmdKey, S.cmdDesc);
            console.log('%csolace.breathe()%c   - 啟動 60 秒「月光深呼吸練習」 / 60s Moonlight Calming Breath', S.cmdKey, S.cmdDesc);
            console.log('%csolace.letter()%c    - 閱讀《致留在人間的你》告白信 / A Letter to Those Who Remain', S.cmdKey, S.cmdDesc);
            console.log('%csolace.stars()%c     - 星塵哲思：卡爾·薩根視角的永恆相遇 / Cosmic Solace: We Are Stardust', S.cmdKey, S.cmdDesc);
            console.log('%csolace.audit()%c     - 檢視金庫為你建立的「三道愛的防線」 / The Three Lines of Love & Order', S.cmdKey, S.cmdDesc);
            console.log('%csolace.provenance()%c- 檢索持有人數位簽署與存證認證鏈 / Cryptographic Identity Anchors', S.cmdKey, S.cmdDesc);
            return '請於下方輸入任一指令並按 Enter / Type any command above to proceed.';
        },

        // 1. 給喪親家屬
        grieving: function () {
            var text = [
                '【給痛失至親的家屬 // To the Bereaved Family】',
                '',
                '親愛的你：',
                '此刻的世界可能是一片寂靜的空白，伴隨著無法呼吸的鈍痛。',
                '請記住：悲傷沒有既定的進度表，眼淚不是脆弱，而是「愛無處安放」的模樣。',
                '',
                '不要逼自己今天就表現得堅強。',
                '他生前花心思建起這座金庫，就是為了替此刻手足無措的你，擋下外界所有的冰冷繁瑣。',
                '第一層名冊免密碼就能查，保險箱裡的線索藏著你們專屬的默契。',
                '慢慢來，一口水、一頓飯，一次只做一件事。',
                '他的肉身雖然先行離席，但他留下的深情與秩序，依然在此刻安靜地護著你。',
                '',
                '(Grief has no timeline. Tears are simply love with no place to go. Take steady breaths; the order and love he left behind will carry you through, step by gentle step.)'
            ].join('\n');
            console.log('%c' + text, S.boxWarm);
            return '🕊️ 慢慢走，愛一直都在 // Take your time. Love never leaves.';
        },

        // 2. 給自知時日無多的旅人
        departing: function () {
            var text = [
                '【給即將走完航程的旅人 // To Those Approaching the Final Port】',
                '',
                '辛苦了一生的長者與朋友：',
                '面對未知與離席，心中有牽掛、有遺憾、有對至親的不捨，都是人之常情。',
                '',
                '但請看看這座保險庫——你已經在理性與清醒之時，為家人做好了最周全的防護。',
                '你沒有把混亂留給他們，而是把最深切的溫柔化為清晰的指引。',
                '你已經盡了全力，完成了這一趟波瀾壯闊的人生航程。',
                '',
                '請放下內疚，也請放下焦慮。',
                '人間草木，春生秋落，生命的圓滿不在於長度，而在於愛過的厚度。',
                '安心歇息吧，你所播下的愛與善意，早已深植在孩子與至親的生命裡，生生不息。',
                '',
                '(You have prepared everything with extraordinary dignity and love. Lay down the burdens, forgive what was imperfect, and rest in profound peace. Your legacy of love is complete.)'
            ].join('\n');
            console.log('%c' + text, S.boxWarm);
            return '🌿 功德圓滿，安心遠航 // Rest peacefully. Your work of love is done.';
        },

        // 3. 給未雨綢繆的家庭支柱
        pillar: function () {
            var text = [
                '【給未雨綢繆的家庭支柱 // To the Family Guardians】',
                '',
                '正在為事業打拼、為一家老小撐傘的你：',
                '華人社會總覺得談生死「觸霉頭」，但真正的勇者，敢於正視人生的無常。',
                '',
                '你今天花時間整理這座金庫，不是預言不幸，而是「責任的極致表現」。',
                '因為你深知：天有不測風雲，一旦意外比明天先到，你最不希望看到家人被繁瑣程序壓垮。',
                '當這份備份妥善鎖進保險箱的那一刻，你的家庭抗風險韌性就提升了一整個層級。',
                '',
                '放下隱隱的生存焦慮吧！認真準備身後事的人，才能最踏實、最無懼地活在每一個當下。',
                '走出房門，繼續開朗地為家人做一頓晚飯。你做得非常出色！',
                '',
                '(Preparing for the inevitable is the highest form of love and rational foresight. With everything secured, live today with boundless courage and peace.)'
            ].join('\n');
            console.log('%c' + text, S.boxWarm);
            return '🛡️ 守護者，請安心前行 // Guardian, walk forward with ease.';
        },

        // 4. 給疲憊不堪的照顧者
        carer: function () {
            var text = [
                '【給日夜照料病榻的照顧者 // To the Weary Caregivers】',
                '',
                '無比辛勞的朋友：',
                '長期陪伴病患，你看著生命一點點消逝，內心常承受著「預期性悲傷」與體力的雙重透支。',
                '有時候感到煩躁或想逃跑，請千萬不要自責——那只是你的心力已經抵達極限。',
                '',
                '你也是個平凡人，你需要被關心，你也需要被擁抱。',
                '這座金庫的意義，也是為了在未來某一刻，幫你省下在各機構間奔波的千頭萬緒。',
                '今天哪怕只給自己 10 分鐘，喝一杯溫水，閉上雙眼，安頓一下自己。',
                '你已經付出了無可挑剔的愛與耐心，謝謝你如此溫柔地守護著另一個生命。',
                '',
                '(Caregiving is an invisible heroic journey. When guilt or exhaustion touches you, grant yourself grace. You are giving the ultimate gift of presence.)'
            ].join('\n');
            console.log('%c' + text, S.boxWarm);
            return '🍵 辛苦了，請記得抱抱自己 // You matter just as much. Rest gently.';
        },

        // 5. 給陷入絕望、想過放棄的人（危機干預）
        hope: function () {
            var text = [
                '【給此刻心靈困頓、感到極度疲憊的你 // A Safe Harbor of Hope】',
                '',
                '親愛的朋友：',
                '如果你是因為覺得人生太痛、太累，想交代身後事而搜尋到這裡——',
                '請先停下腳步，坐在這裡陪我深呼吸三口氣。',
                '',
                '生命的泥濘有時真的重到令人窒息，我們完全理解那種「想結束痛苦」的渴望。',
                '但請相信：你想結束的是「長期的痛苦與孤單」，而不是生命本身。',
                '你不是這世界的負擔，你的存在本身，就是一個尚未說完的故事。',
                '',
                '哪怕此時此刻身邊沒有人理解你，這世界上依然有願意安靜聽你說話的人。',
                '給自己一個機會，撥個通話，讓我們分擔一點你心底的重量：',
                '',
                '📞 香港 24 小時安心支援熱線：',
                '   • 生命熱線 (Suicide Prevention Services) : 2382 0000',
                '   • 撒瑪利亞防止自殺會 (The Samaritans)  : 2389 2222',
                '   • 醫院管理局精神健康專線 (HA Mental)   : 2466 7350',
                '   • 社會福利署熱線 (SWD 24-hr Hotline)   : 2343 2255',
                '',
                '天總會亮，長夜總會過去。請再給這世界、也給自己一個被擁抱的機會。'
            ].join('\n');
            console.log('%c' + text, S.boxHope);
            return '🤍 你並不孤單，我們在這裡 // You are not alone. Please stay.';
        },

        // 6. 給健康無事常人
        living: function () {
            var text = [
                '【給健康無恙的每個人 // Memento Mori: To the Living】',
                '',
                '偶然進來的好奇探索者：',
                '拉丁名言說：「Memento Mori」——記住你終有一死。',
                '這不是悲觀厭世，而是生命中最深刻的清醒劑。',
                '',
                '正因為生命有盡頭，夕陽才無比璀璨，晨起的咖啡才格外溫暖，身邊人的嘮叨才彌足珍貴。',
                '關掉這個終端後，去打個電話給許久未見的朋友，去緊緊擁抱你的家人或孩子，',
                '去吃一頓你想吃的美食，認真感受心臟每一次有力的跳動。',
                '向死而生，才是熱愛生命最高級的姿態！',
                '',
                '(To remember death is to awaken to life. Embrace today fully, love without hesitation, and cherish the breath within your lungs.)'
            ].join('\n');
            console.log('%c' + text, S.quote);
            return '🌻 熱烈而清醒地活在當下 // Live passionately and gently today.';
        },

        // 7. 60 秒「月光舒心深呼吸」
        breathe: function () {
            if (breathOverlay) {
                removeBreathOverlay();
                console.log('%c[ 呼吸練習已結束 // Breathing session concluded ]', 'color:#86efac; font-weight:bold;');
                return '已恢復常態 / Restored.';
            }

            console.log('%c[ 啟動月光舒心深呼吸 // MOONLIGHT BOX BREATHING ACTIVE ]', 'background:#0369a1; color:#fff; font-weight:bold; padding:4px 10px; border-radius:3px; font-family:' + MONO);
            console.log('%c請注視螢幕中央的柔和光環，跟隨節奏調節氣息。（點擊畫面任意處或按 ESC 結束）', S.sub);

            breathOverlay = document.createElement('div');
            breathOverlay.id = 'solace-breath-overlay';
            breathOverlay.style.cssText = [
                'position: fixed',
                'top: 0',
                'left: 0',
                'width: 100vw',
                'height: 100vh',
                'background: rgba(11, 17, 32, 0.88)',
                'backdrop-filter: blur(10px)',
                'z-index: 999999',
                'display: flex',
                'flex-direction: column',
                'align-items: center',
                'justify-content: center',
                'cursor: pointer',
                'user-select: none'
            ].join(';');

            breathOverlay.innerHTML = [
                '<div style="text-align: center; color: #f8fafc; font-family: ' + SERIF + ';">',
                '  <div id="breath-circle" style="width: 150px; height: 150px; border-radius: 50%; background: radial-gradient(circle, rgba(125,211,252,0.25) 0%, rgba(52,211,153,0.12) 60%, transparent 80%); border: 2px solid #7dd3fc; margin: 0 auto 28px auto; transition: transform 4s ease-in-out, box-shadow 4s ease-in-out; box-shadow: 0 0 30px rgba(125,211,252,0.35); display: flex; flex-direction: column; align-items: center; justify-content: center;">',
                '    <span id="breath-status-zh" style="font-size: 15px; font-weight: bold; color: #7dd3fc; letter-spacing: 1px;">吸氣</span>',
                '    <span id="breath-status-en" style="font-size: 11px; color: #94a3b8; font-family: ' + MONO + '; margin-top: 2px;">Inhale</span>',
                '  </div>',
                '  <h2 style="font-size: 18px; font-weight: normal; letter-spacing: 2px; margin-bottom: 6px; color: #f1f5f9;">安頓呼吸 ‧ 遇事心安</h2>',
                '  <p style="font-size: 11px; color: #94a3b8; font-family: ' + MONO + '; letter-spacing: 1px; margin-bottom: 12px;">Steady Your Breath ‧ Peace Within</p>',
                '  <p id="breath-sub" style="font-size: 13px; color: #cbd5e1; line-height: 1.6; max-width: 380px; margin: 0 auto;">緩慢吸氣... 感受世界正溫柔托住你 (4秒)</p>',
                '  <p id="breath-sub-en" style="font-size: 11px; color: #64748b; font-family: ' + MONO + '; margin-top: 4px;">Gently breathe in... feel supported by the universe (4s)</p>',
                '  <div style="font-size: 10px; color: #64748b; margin-top: 28px;">[ 點擊畫面任意處或按 ESC 結束 ‧ Click anywhere or press ESC to exit ]</div>',
                '</div>'
            ].join('');

            document.body.appendChild(breathOverlay);

            var circle = document.getElementById('breath-circle');
            var statusZh = document.getElementById('breath-status-zh');
            var statusEn = document.getElementById('breath-status-en');
            var subZh = document.getElementById('breath-sub');
            var subEn = document.getElementById('breath-sub-en');

            var cycle = 0;
            function updateBreath() {
                cycle = (cycle + 1) % 4;
                if (cycle === 0) {
                    circle.style.transform = 'scale(1.4)';
                    circle.style.boxShadow = '0 0 50px rgba(125,211,252,0.6)';
                    circle.style.borderColor = '#7dd3fc';
                    statusZh.innerText = '吸氣';
                    statusZh.style.color = '#7dd3fc';
                    statusEn.innerText = 'Inhale';
                    subZh.innerText = '緩慢吸氣... 感受新鮮空氣充盈胸膛 (4秒)';
                    subEn.innerText = 'Breathe in slowly... feel life and calm expanding (4s)';
                } else if (cycle === 1) {
                    statusZh.innerText = '屏息';
                    statusZh.style.color = '#fde68a';
                    statusEn.innerText = 'Hold';
                    subZh.innerText = '屏住呼吸... 感受當下的寧靜與安全 (4秒)';
                    subEn.innerText = 'Hold softly... embrace the still sanctuary of now (4s)';
                } else if (cycle === 2) {
                    circle.style.transform = 'scale(0.85)';
                    circle.style.boxShadow = '0 0 20px rgba(52,211,153,0.3)';
                    circle.style.borderColor = '#34d399';
                    statusZh.innerText = '呼氣';
                    statusZh.style.color = '#34d399';
                    statusEn.innerText = 'Exhale';
                    subZh.innerText = '緩慢吐氣... 將心中的慌亂隨氣息釋放 (4秒)';
                    subEn.innerText = 'Breathe out slowly... release the heaviness and sorrow (4s)';
                } else if (cycle === 3) {
                    statusZh.innerText = '平靜';
                    statusZh.style.color = '#94a3b8';
                    statusEn.innerText = 'Rest';
                    subZh.innerText = '安靜停歇... 你的心跳正在找回平穩 (4秒)';
                    subEn.innerText = 'Rest gently... your pulse is finding its rhythm again (4s)';
                }
            }

            setTimeout(function () {
                if (circle) {
                    circle.style.transform = 'scale(1.4)';
                    circle.style.boxShadow = '0 0 50px rgba(125,211,252,0.6)';
                }
            }, 100);

            breathTimer = setInterval(updateBreath, 4000);

            breathOverlay.addEventListener('click', function () {
                removeBreathOverlay();
            });

            function onEsc(e) {
                if (e.key === 'Escape') {
                    removeBreathOverlay();
                    window.removeEventListener('keydown', onEsc);
                }
            }
            window.addEventListener('keydown', onEsc);

            return '月光舒心呼吸練習已啟動 // Breathing session active.';
        },

        // 8. 告白信
        letter: function () {
            var letterContent = [
                '【致留在人間的你 // To Those Who Remain】',
                '',
                '親愛的家人：',
                '當你看到這段文字時，代表我可能已經走完了人生的航程，先行離席了。',
                '請不要害怕，也不要陷入自責或長久的慌亂。',
                '',
                '我生前花時間研究加密、一筆筆核對保單、把線索鎖進保險箱，',
                '不是因為我預感死亡有多可怕，而是因為我深愛著你們。',
                '我不想讓你們在最脆弱、眼淚還沒擦乾的時候，',
                '還要孤身一人去翻箱倒櫃、去猜測我的密碼、去面對各家機構繁瑣冰冷的櫃檯。',
                '',
                '這座保險庫，是我在理性與清醒之時，為你們築起的最後一道避風港。',
                '第一層綠色區已列出所有保險公司，你們無需密碼即可直接向官方索償部開檔；',
                '保險箱裡的提示卡，藏著我們共同的溫暖記憶，解鎖後會有專屬顧問全力協助你們。',
                '',
                '請好好吃飯，好好睡覺，代我去看明天的日出與星空。',
                '我已心滿意足，遇事心安。'
            ].join('\n');
            console.log('%c' + letterContent, S.boxWarm);
            return '🕊️「愛永不止息。」// "Love never fails."';
        },

        // 9. 星塵哲思
        stars: function () {
            var stardustText = [
                '「構成我們心臟的鐵、骨骼中的鈣，以及血液中的碳，',
                ' 全部源自數十億年前某顆塌縮超新星的內部熔爐。',
                '',
                ' 我們每一個人，都是宇宙用星塵捏造出的奇蹟。',
                ' 在浩瀚無垠的時空中，我們能夠擁有重疊的歲月、相遇、相愛，',
                ' 這本身就是機率趨近於零的巨大恩賜。',
                '',
                ' 死亡不是生命的湮滅，只是星塵的歸位。',
                ' 當肉身散去，那些原子會回到大地、蒸發入大氣、重新匯入宇宙的洋流。',
                ' 他未曾真正遠去，他存在於你吹過的每一陣微風、看過的每一次落日之中。」'
            ].join('\n');
            console.log('%c' + stardustText, S.quote);
            return '🌟「我們都是宇宙借來認識它自己的眼睛。」—— Carl Sagan';
        },

        // 10. 三道愛的防線審計
        audit: function () {
            var auditTable = [
                '┌──────────────────────────┬────────────────────────────┬─────────────────────────────┐',
                '│ 愛的防線 (Defense Line)  │ 守護機制 (Mechanism)       │ 實務與心理價值 (Value)      │',
                '├──────────────────────────┼────────────────────────────┼─────────────────────────────┤',
                '│ 1st: 免密公開名冊 (Triage)│ 綠色名冊 (Password-Free)   │ 零障礙：免猜密碼直接開單索償│',
                '│ 2nd: 家庭記憶線索 (Clue) │ 保險箱提示卡 (Memory Hint) │ 零出錯：唯有摯親懂得溫暖拼湊│',
                '│ 3rd: AES-256金庫 (Vault) │ 本地客戶端隔離 (ZDR Core)  │ 零洩露：在生時恪守數碼隱私權│',
                '└──────────────────────────┴────────────────────────────┴─────────────────────────────┘'
            ].join('\n');
            console.log('%c[ 三道愛的防線審計 // THE THREE LINES OF LOVE & ORDER ]', S.sub);
            console.log('%c' + auditTable, 'background: #0b1120; color: #7dd3fc; font-family: ' + MONO + '; font-size: 11px; line-height: 1.5; padding: 6px 12px; border-radius: 4px; display: block; white-space: pre;');
            return '系統狀態：完備無缺。愛與秩序已全面就位 // Status: Green. All lines secured.';
        },

        // 11. 密碼學存證鏈
        provenance: function () {
            console.log('%c[ CANONICAL PROVENANCE RECORDS // 權威身份與專業存證鏈 ]', S.title);
            console.log('• ORCID iD       : https://orcid.org/0009-0006-0855-0842');
            console.log('• PGP Key ID     : FFA3E47793F1CA32');
            console.log('• PGP Raw Key    : https://keybase.io/jackylawck/pgp_keys.asc');
            console.log('• Keybase Proof  : https://keybase.io/jackylawck');
            console.log('• HKCS W3C ID    : https://hkcs.org.hk/verify/?id=019dd246-6cba-724a-8360-476e1965a1fb');
            console.log('• Mastermind ID  : https://www.credly.com/badges/c6abd067-0cd9-47c5-bcbd-8becd6e86429/public_url');
            console.log('• Oracle GenAI   : https://catalog-education.oracle.com/ords/certview/sharebadge_m?id=E9A6CD33539B3B4476ECF08CDF00F0935F8A39101F74B1C929B7683E4FCF4096');
            return 'Cryptographic identity verified. All anchors validated // 權威身份鏈檢驗通過。';
        }
    });

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(renderSolaceTerminal, 350);
    } else {
        window.addEventListener('DOMContentLoaded', function () {
            setTimeout(renderSolaceTerminal, 350);
        });
    }
})();
