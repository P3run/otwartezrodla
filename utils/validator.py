import json
import requests

def validate_folder(folder, path):
    for node in folder:
        if node['type'] == 'url':
            validate_url(node['url'], f'{path} > {node['name']}')
        elif node['type'] == 'folder':
            validate_folder(node['children'], f'{path} > {node['name']}')


def validate_url(url, path):
    try:
        r = requests.get(url, timeout=10)
        code = f'{r.status_code}'
    except:
        code = 'exception'

    if code != '200':
        print(f'{path}\t\t\t{code}')

if __name__ == '__main__':
    with open('./../public/arf.json') as f:
        nodes = json.load(f)

        validate_folder(nodes['children'], nodes['name'])