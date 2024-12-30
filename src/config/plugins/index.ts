/*
 * Copyright 2016-present the IoT DC3 original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import ElementPlugins from '@/config/plugins/element/element.js'
import HighlightJSPlugins from '@/config/plugins/highlight/highlight.js'

export default (app: any) => {
    ElementPlugins(app)
    HighlightJSPlugins(app)

    console.log(
        '.___     ___________ ________  _________ ________\n' +
            '|   | ___\\__    ___/ \\______ \\ \\_   ___ \\\\_____  \\\n' +
            '|   |/  _ \\|    |     |    |  \\/    \\  \\/  _(__  <\n' +
            '|   (  <_> )    |     |    `   \\     \\____/       \\\n' +
            '|___|\\____/|____|    /_______  /\\______  /______  /\n' +
            '                             \\/        \\/       \\/\n' +
            'https://doc.dc3.site\n' +
            'IoT DC3 Platform V2024.3.0'
    )
}
